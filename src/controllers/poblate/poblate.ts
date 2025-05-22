import { Request, Response } from 'express';

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

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomPassword() {
  return makeid(12); // strong 12-character password
}

function generateRandomName() {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Miller'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function generateRandomEmail() {
  const username = makeid(8).toLowerCase();
  const domains = ['example.com', 'testmail.com', 'mydomain.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectRandomElements(array, numElements) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, numElements);
}

function generateLoremIpsum(wordCount) {
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
    "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
    "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
    "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip",
    "ex", "ea", "commodo", "consequat"
  ];

  let result = [];
  for (let i = 0; i < wordCount; i++) {
    const word = loremWords[Math.floor(Math.random() * loremWords.length)];
    result.push(word);
  }
  return result.join(" ") + ".";
}

async function createUsers() {
  const teachers = [];
  const students = [];

  for (let i = 0; i < 5; i++) {
    const email = generateRandomEmail();
    const password = generateRandomPassword();

    console.log(`${i} teacher email ${email} password ${password}`);

    const hashPassword = await generateHashPassword(password);

    teachers.push(
      new User({
        name: 
        email,
        password: hashPassword,
        role: 'teacher',
      }),
    );
  }

  for (let i = 0; i < 30; i++) {
    const email = generateRandomEmail();
    const password = generateRandomPassword();

    console.log(`${i} student email ${email} password ${password}`);

    const hashPassword = await generateHashPassword(password);

    students.push(
      new User({
        name: generateRandomName(),
        email,
        password: hashPassword,
        role: 'student',
        cohort: `20${generateRandomNumber(22, 25)}-${generateRandomNumber(1, 2)}`,
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
      cohort: `20${generateRandomNumber(22, 25)}-${generateRandomNumber(1, 2)}`,
    })
  );

  await User.insertMany([...teachers, ...students]);
  console.log('Users created');
  return { teachers, students };
}

async function createClasses(teachers: any[], students: any[]) {
  const classes = [];

  for (let i = 0; i < 3; i++) {
    const classTeachers = selectRandomElements(teachers, 2);
    const classStudents = selectRandomElements(students, 10);

    const newClass = new Class({
      name: `Class ${i + 1}`,
      description: generateLoremIpsum(10),
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
      const numTasks = generateRandomNumber(2, 6);
      for (let i = 0; i < numTasks; i++) {
        await new Homework({
          content: generateLoremIpsum(10),
          class: classDoc._id,
          student: student._id,
          teacher: selectRandomElements(teachers, 1)[0]._id,
          score: parseFloat(generateRandomNumber(2.0, 5.0).toFixed(1)),
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
