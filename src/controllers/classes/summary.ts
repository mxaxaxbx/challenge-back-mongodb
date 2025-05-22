import { Request, Response } from 'express';

import { Class } from "../../models/class";

export const classSummary = async (req: Request, res: Response) => {
  const classId = req.params.id;
  console.log('classId', classId);

  const classWithDetails = await Class.aggregate([
    { $match: { _id: classId } },

    // Poblamos profesores
    {
      $lookup: {
        from: "users",
        localField: "teachers",
        foreignField: "_id",
        as: "teacherDetails",
      },
    },

    // Poblamos estudiantes
    {
      $lookup: {
        from: "users",
        localField: "students",
        foreignField: "_id",
        as: "studentDetails",
      },
    },

    // Traemos tareas de los estudiantes en esta clase
    {
      $lookup: {
        from: "homeworks",
        let: { classId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$class", "$$classId"] } } },
          {
            $group: {
              _id: "$student",
              avgScore: { $avg: "$score" },
              taskCount: { $sum: 1 },
            },
          },
        ],
        as: "studentStats",
      },
    },

    // Combinamos los detalles de estudiantes con sus estadísticas
    {
      $addFields: {
        students: {
          $map: {
            input: "$studentDetails",
            as: "student",
            in: {
              _id: "$$student._id",
              name: "$$student.name",
              email: "$$student.email",
              cohort: "$$student.cohort",
              role: "$$student.role",
              stats: {
                $let: {
                  vars: {
                    match: {
                      $first: {
                        $filter: {
                          input: "$studentStats",
                          as: "stat",
                          cond: { $eq: ["$$stat._id", "$$student._id"] },
                        },
                      },
                    },
                  },
                  in: {
                    avgScore: "$$match.avgScore",
                    taskCount: "$$match.taskCount",
                  },
                },
              },
            },
          },
        },
      },
    },

    // Calculamos leaderboard (top estudiantes por promedio de nota)
    {
      $addFields: {
        leaderboard: {
          $slice: [
            {
              $sortArray: {
                input: "$students",
                sortBy: { "stats.avgScore": -1 },
              },
            },
            5, // top 5
          ],
        },
      },
    },

    // Seleccionamos los campos finales
    {
      $project: {
        name: 1,
        description: 1,
        teachers: "$teacherDetails",
        students: 1,
        leaderboard: 1,
      },
    },
  ]);

  console.log('classWithDetails', classWithDetails);

  res.status(200);
  res.json('classWithDetails');
};

