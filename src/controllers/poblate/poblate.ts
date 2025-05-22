import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

import { User } from '../../models/user';
import { Class } from '../../models/class';
import { Homework } from '../../models/homeworks';

import { generateHashPassword } from '../../utils/password';

async function clearDatabase() {
  await User.deleteMany({});
  await Class.deleteMany({});
  await Homework.deleteMany({});
  console.log('Database cleared');
}

async function createUsers() {
  const teachers = [];
  const students = [];

  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    console.log(`${i} teacher email ${email} password ${password}`);

    const hashPassword = await generateHashPassword(password);

    teachers.push(
      new User({
        name: faker.person.fullName(),
        email,
        password: hashPassword,
        role: 'teacher',
      }),
    );
  }

  for (let i = 0; i < 30; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    console.log(`${i} student email ${email} password ${password}`);

    const hashPassword = await generateHashPassword(password);

    students.push(
      new User({
        name: faker.person.fullName(),
        email,
        password: hashPassword,
        role: 'student',
        cohort: `20${faker.number.int({ min: 22, max: 25 })}-${faker.number.int({ min: 1, max: 2 })}`,
      }),
    );
  }

  const teacherEmail = 'mxaxaxbx@gmail.com';
  const teacherPassword = 'P455W0rd!';

  console.log(`teacher email ${teacherEmail} password ${teacherPassword}`);

  const hashTeacherPassword = await generateHashPassword(teacherPassword);

  teachers.push(
    new User({
      name: 'Miguel Arenas',
      email: teacherEmail,
      password: hashTeacherPassword,
      role: 'teacher',
    })
  );

  const studentEmail = 'mxaxaxbx@outlook.com';
  const studentPassword = 'P455W0rd!';

  console.log(`student email ${studentEmail} password ${studentPassword}`);

  const hashStudentPassword = await generateHashPassword(studentPassword);

  students.push(
    new User({
      name: 'Carlos Mira',
      email: studentEmail,
      password: hashStudentPassword,
      role: 'student',
      cohort: `20${faker.number.int({ min: 22, max: 25 })}-${faker.number.int({ min: 1, max: 2 })}`,
    })
  );

  await User.insertMany([...teachers, ...students]);
  console.log('Users created');
  return { teachers, students };
}

async function createClasses(teachers: any[], students: any[]) {
  const classes = [];

  for (let i = 0; i < 3; i++) {
    const classTeachers = (faker.helpers as any).arrayElements(teachers, 2);
    const classStudents = (faker.helpers as any).arrayElements(students, 10);

    const newClass = new Class({
      name: `Class ${i + 1}`,
      description: faker.lorem.sentence(),
      teachers: classTeachers.map(t => t._id),
      students: classStudents.map(s => s._id),
    });

    await newClass.save();
    classes.push({ class: newClass, students: classStudents, teachers: classTeachers });
  }

  console.log('Classes created');
  return classes;
}

async function createHomeworks(classesWithMembers: any[]) {
  for (const { class: classDoc, students, teachers } of classesWithMembers) {
    for (const student of students) {
      const numTasks = faker.number.int({ min: 2, max: 6 });
      for (let i = 0; i < numTasks; i++) {
        await new Homework({
          content: faker.lorem.sentence(),
          class: classDoc._id,
          student: student._id,
          teacher: (faker.helpers as any).arrayElement(teachers)._id,
          score: parseFloat(faker.number.float({ min: 2.0, max: 5.0 }).toFixed(1)),
        }).save();
      }
    }
  }

  console.log('Homeworks created');
}


export const poblate = async (req: Request, res: Response) => {
  await clearDatabase();

  const { teachers, students } = await createUsers();
  const classesWithMembers = await createClasses(teachers, students);
  await createHomeworks(classesWithMembers);

  res.status(200);
  res.send('Database populated');
};
