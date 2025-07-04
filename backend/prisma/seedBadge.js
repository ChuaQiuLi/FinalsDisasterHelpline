const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main() {
  
  // Delete all badges first
  await prisma.badge.deleteMany();
  console.log('All existing badges deleted.');


  const badges = [
    {
      badge_name: 'Earthquake Quiz Badge',
      description: 'Awarded for completing earthquake quiz with full marks.',
      badge_image_filled: 'earthquake_quiz',
      badge_image_outline: 'earthquake_quiz_outline',
      criteria: 'Get full marks for earthquake quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Flood Quiz Badge',
      description: 'Awarded for completing flood quiz with full marks.',
      badge_image_filled: 'flood_quiz',
      badge_image_outline: 'flood_quiz_outline',
      criteria: 'Get full marks for flood quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Drought Quiz Badge',
      description: 'Awarded for completing drought quiz with full marks.',
      badge_image_filled: 'drought_quiz',
      badge_image_outline: 'drought_quiz_outline',
      criteria: 'Get full marks for drought quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Forest Fire Quiz Badge',
      description: 'Awarded for completing forest fire quiz with full marks.',
      badge_image_filled: 'forest_fire_quiz',
      badge_image_outline: 'forest_fire_quiz_outline',
      criteria: 'Get full marks for forest fire quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Tropical Cyclone Quiz Badge',
      description: 'Awarded for completing tropical cyclone quiz with full marks.',
      badge_image_filled: 'tropical_cyclone_quiz',
      badge_image_outline: 'tropical_cyclone_quiz_outline',
      criteria: 'Get full marks for tropical cyclone quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Tsunami Quiz Badge',
      description: 'Awarded for completing tsunami quiz with full marks.',
      badge_image_filled: 'tsunami_quiz',
      badge_image_outline: 'tsunami_quiz_outline',
      criteria: 'Get full marks for tsunami quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Volcano Quiz Badge',
      description: 'Awarded for completing volcano quiz with full marks.',
      badge_image_filled: 'volcano_quiz',
      badge_image_outline: 'volcano_quiz_outline',
      criteria: 'Get full marks for volcano quiz',
      earned_from: 'quiz'
    },

    {
      badge_name: 'Checklist Badge',
      description: 'Awarded for completing adding checklist items in checklist.',
      badge_image_filled: 'checklist',
      badge_image_outline: 'checklist_outline',
      criteria: 'Add an item in checklist',
      earned_from: 'checklist'
    },


  ];



  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
    console.log(`Seeded badge: ${badge.badge_name}`);

  }

    console.log('\n Badge seeding complete!');

}




main()
  .catch(e => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })

  .finally(() => prisma.$disconnect());