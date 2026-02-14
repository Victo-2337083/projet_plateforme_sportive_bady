import 'dotenv/config';
import mongoose from 'mongoose';
import { DailyConceptSchema, DraftConceptSchema, ExerciseSchema } from './content/content.schemas';
import { UserSchema } from './users/user.schema';
import * as bcrypt from 'bcryptjs';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/daily-learning');
  const DailyConcept = mongoose.model('DailyConcept', DailyConceptSchema);
  const Exercise = mongoose.model('Exercise', ExerciseSchema);
  const DraftConcept = mongoose.model('DraftConcept', DraftConceptSchema);
  const User = mongoose.model('User', UserSchema);

  await Promise.all([DailyConcept.deleteMany({}), Exercise.deleteMany({}), DraftConcept.deleteMany({}), User.deleteMany({})]);
  const admin = await User.create({ username: 'admin', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin' });

  const concepts = Array.from({ length: 14 }).flatMap((_, i) =>
    ['fr', 'en'].map((lang) => ({
      dateKey: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      title: lang === 'fr' ? `Concept ${i + 1}` : `Concept ${i + 1}`,
      story: lang === 'fr' ? `Petite histoire éducative ${i + 1}` : `Short educational story ${i + 1}`,
      content: lang === 'fr' ? `Leçon courte ${i + 1}` : `Short lesson ${i + 1}`,
      tags: ['math', 'logic'],
      gradeBands: ['6-8', '9-12'],
      lang
    }))
  );
  const created = await DailyConcept.insertMany(concepts);
  const exercises = created.flatMap((c) => [
    { conceptId: c._id, type: 'qcm', prompt: `QCM ${c.title}`, options: ['A', 'B', 'C'], answer: { correct: 'A' }, explanation: 'Bravo !', difficulty: 1, lang: c.lang },
    { conceptId: c._id, type: 'association', prompt: `Associe ${c.title}`, options: ['1-1', '2-2'], answer: { pairs: [['1', '1'], ['2', '2']] }, explanation: 'Bonne association', difficulty: 1, lang: c.lang },
    { conceptId: c._id, type: 'memory', prompt: `Memory ${c.title}`, options: ['x', 'x'], answer: { pairs: [['x', 'x']] }, explanation: 'Super mémoire', difficulty: 1, lang: c.lang }
  ]);
  await Exercise.insertMany(exercises);

  await DraftConcept.create({
    dateKey: new Date().toISOString().slice(0, 10),
    title: 'Brouillon IA',
    story: 'Story',
    content: 'Content',
    tags: ['science'],
    gradeBands: ['9-12'],
    lang: 'fr',
    status: 'draft',
    moderationResult: { flagged: false },
    createdBy: admin._id
  });

  await mongoose.disconnect();
}
run();
