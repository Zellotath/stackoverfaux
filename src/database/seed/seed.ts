import { Answer, PrismaClient, Question, User } from '@prisma/client';
import SeedData from './stackoverfaux.json';

type SeedQuestion = (typeof SeedData)[0];
type SeedUser = SeedQuestion['user'];
type SeedComment = SeedQuestion['comments'][0];
type SeedAnswer = SeedQuestion['answers'][0];

const prisma = new PrismaClient();

async function upsertUser(seedUser: SeedUser): Promise<User> {
  const user = await prisma.user.upsert({
    where: { id: seedUser.id },
    update: {},
    create: {
      ...seedUser
    }
  });
  return user;
}

async function createComment(
  seedComment: SeedComment,
  parentQuestion?: Question,
  parentAnswer?: Answer
): Promise<void> {
  if (!parentQuestion && !parentAnswer) {
    throw new Error('Comment must have a parent');
  }

  const commentUser = await upsertUser(seedComment.user);
  await prisma.comment.create({
    data: {
      id: seedComment.id,
      body: seedComment.body,
      userId: commentUser.id,
      parentAnswerId: parentAnswer?.id,
      parentQuestionId: parentQuestion?.id
    }
  });
}

async function createAnswer(seedAnswer: SeedAnswer, parentQuestion: Question): Promise<Answer> {
  const answerUser = await upsertUser(seedAnswer.user);
  const answer = await prisma.answer.create({
    data: {
      id: seedAnswer.id,
      body: seedAnswer.body,
      accepted: seedAnswer.accepted,
      score: seedAnswer.score,
      creation: new Date(seedAnswer.creation),
      userId: answerUser.id,
      questionId: parentQuestion.id
    }
  });

  for (const seedComment of seedAnswer.comments) {
    await createComment(seedComment, undefined, answer);
  }

  return answer;
}

async function createQuestion(seedQuestion: SeedQuestion): Promise<Question> {
  const questionUser = await upsertUser(seedQuestion.user);
  const question = await prisma.question.create({
    data: {
      id: seedQuestion.id,
      title: seedQuestion.title,
      body: seedQuestion.body,
      score: seedQuestion.score,
      creation: new Date(seedQuestion.creation),
      userId: questionUser.id
    }
  });

  for (const seedAnswer of seedQuestion.answers) {
    await createAnswer(seedAnswer, question);
  }

  for (const seedComment of seedQuestion.comments) {
    await createComment(seedComment, question);
  }

  return question;
}

async function main() {
  for (const seedQuestion of SeedData) {
    await createQuestion(seedQuestion);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
