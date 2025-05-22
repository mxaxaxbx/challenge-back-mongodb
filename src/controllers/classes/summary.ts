import { Request, Response } from 'express';
import mongoose from "mongoose";

import { Class } from "../../models/class";

export const classSummary = async (req: Request, res: Response) => {
  const classId = req.params.id;

  const classWithDetails = await Class.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(classId),
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "teachers",
        foreignField: "_id",
        as: "teacherDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "students",
        foreignField: "_id",
        as: "studentDetails",
      },
    },
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

  res.status(200);
  res.json(classWithDetails);
};

