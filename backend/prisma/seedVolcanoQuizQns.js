const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



async function upsertQuizWithQuestions(data) {
  try {
    // Find the disaster by name 
    const disaster = await prisma.disaster.findUnique({
      where: { disaster_name: data.disaster_name }

    });


    if (!disaster) {
      console.error(`Disaster '${data.disaster_name}' not found.`);
      return;

    }

    // Check if the quiz already exists for the given title and disaster
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        quiz_title: data.quiz_title,
        disaster_id: disaster.disaster_id
      },

      include: {
        // Include existing questions and their answers
        quizQuestions: {
          include: { quizAnswer: true }
        }
      }

    });


    // If the quiz exists, delete all related questions and answers 
    if (existingQuiz) {
      // Delete related answers and questions
      for (const question of existingQuiz.quizQuestions) {
        await prisma.quizAnswer.deleteMany({ where: { question_id: question.question_id } });

      }

      await prisma.quizQuestions.deleteMany({
        where: { quiz_id: existingQuiz.quiz_id }

      });

      console.log(`Deleted existing questions for quiz: ${data.quiz_title}`);

    }

    // Upsert the quiz: create if it doesn't exist, or update if it does
    const quiz = await prisma.quiz.upsert({
      where: {
        quiz_title: data.quiz_title
      },

      update: {
        quiz_description: data.quiz_description,
        difficulty_level: data.difficulty_level
      },

      create: {
        disaster_id: disaster.disaster_id,
        quiz_title: data.quiz_title,
        quiz_description: data.quiz_description,
        difficulty_level: data.difficulty_level
      }

    });

    console.log(`Upserted quiz: ${quiz.quiz_title}`);

    // Create questions and answers
    for (const qns of data.questions) {
      const question = await prisma.quizQuestions.create({
        data: {
          quiz_id: quiz.quiz_id,
          question: qns.question,
          points: qns.points,
          quizAnswer: {
            create: qns.answers

          }

        }

      });

      console.log(`Created question: ${question.question}`);

    }

  } 
  
  catch (error) {
    console.error(`Error upserting quiz '${data.quiz_title}':`, error);
  }

}



async function main() {
  const quizSeedData = [
    {
      disaster_name: 'Volcano',
      quiz_title: 'Volcano Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of volcano! This beginner-friendly quiz covers what flood are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is a volcano?',
          points: '10',
          answers: [
            {
              answer_text: 'A type of mountain formed by earthquakes',
              is_correct: false,
            },
            {
              answer_text: 'A hill where animals live',
              is_correct: false,
              
            },
            {
              answer_text: `A large cave with crystals inside`,
              is_correct: false,
            },
            {
              answer_text: `An opening in Earth's surface that lets out lava, gas, and ash`,
              is_correct: true,
              answer_explanation: `A volcano is an opening in the Earth's surface where lava, ash, and gases escape during eruptions. They are often formed by tectonic activity.`
            },
            
          ]
        },
        {
          question: `Question 2: Which of the following is a famous volcano?`,
          points: '10',
          answers: [
            {
              answer_text: 'Mount Everest',
              is_correct: false,
            },
            {
              answer_text: 'Mount Fuji',
              is_correct: true,
              answer_explanation: 'Mount Fuji is a famous volcano in Japan. Mount Everest is a mountain, not a volcano.'
            },
            {
              answer_text: 'Grand Canyon',
              is_correct: false,
            },
            {
              answer_text: ' Rocky Mountains',
              is_correct: false,
             
            },

          ]

        },

        {
          question: `Question 3: Which tool is used to measure volcanic activity?`,
          points: '10',
          answers: [
            {
              answer_text: 'Thermometer',
              is_correct: false,
            },
            {
              answer_text: 'Barometer',
              is_correct: false,
              
            },
            {
              answer_text: 'Seismometer',
              is_correct: true,
              answer_explanation: `A seismometer detects ground movements and tremors, which can help predict volcanic eruptions.`
            },
            {
              answer_text: 'Telescope',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 4: What should you do during a volcanic eruption?`,
          points: '10',
          answers: [
            {
              answer_text: 'Stay indoors, close windows and doors',
              is_correct: true,
              answer_explanation: `During an eruption, it's important to stay indoors to avoid breathing in ash and getting hurt by flying debris or lava.`
            },
            {
              answer_text: 'Go outside and watch',
              is_correct: false,
            },
            {
              answer_text: 'Hide under a tree',
              is_correct: false,
            },
            {
              answer_text: 'Take a shower ',
              is_correct: false,
            
            },

          ]

        },
        
        {
          question: `Question 5: What causes a volcano to erupt?`,
          points: '10',
          answers: [
            {
              answer_text: `Heavy rain`,
              is_correct: false,
             
            },
            {
              answer_text: 'Strong sunlight',
              is_correct: false,
            },
            {
              answer_text: 'Too much wind',
              is_correct: false,
            },
            {
              answer_text: `Pressure from molten rock underground`,
              is_correct: true,
              answer_explanation: `Magma builds up pressure under the Earth's crust, and when the pressure becomes too much, it forces its way out as an eruption.`
              
            },

          ]

        },

        {
          question: `Question 6: How can communities stay safe from volcanoes?`,
          points: '10',
          answers: [
            {
              answer_text: `Ignore warnings`,
              is_correct: false,
              
            },
            {
              answer_text: 'Build homes on volcanoes',
              is_correct: false,
            },
            {
              answer_text: 'Have emergency plans and evacuate when needed',
              is_correct: true,
              answer_explanation: 'Having emergency plans, early warnings, and evacuation routes helps people stay safe during volcanic disasters.'
            },
            {
              answer_text: 'Spray water on lava',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: Where are most volcanoes found?`,
          points: '10',
          answers: [
            {
              answer_text: 'In the middle of continents',
              is_correct: false,
            },
            {
              answer_text: 'Only at the North Pole',
              is_correct: false,
            },
            {
              answer_text: 'Along the edges of tectonic plates',
              is_correct: true,
              answer_explanation: 'Most volcanoes are found where tectonic plates meet, especially around the Ring of Fire in the Pacific Ocean.'
            },
            {
              answer_text: 'In deserts only',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 8: What should you bring in a volcanic emergency kit?`,
          points: '10',
          answers: [
            {
              answer_text: 'Toys and games',
              is_correct: false,
              
            },
            {
              answer_text: 'Pillows and books only',
              is_correct: false,
             
            },
            {
              answer_text: 'Water, mask, flashlight, and food',
              is_correct: true,
              answer_explanation: `An emergency kit for a volcanic eruption should include clean water, food, a mask to filter ash, and a flashlight for safety.`
            },
            {
              answer_text: 'Sunglasses and swimwear',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: Why do people live near volcanoes?`,
          points: '10',
          answers: [
            {
              answer_text: 'They like danger',
              is_correct: false,
            },
            {
              answer_text: 'Volcanoes are cold',
              is_correct: false,
            },
            {
              answer_text: 'Volcanoes keep away animals',
              is_correct: false,
              
            },
            {
              answer_text: 'Volcanic soil is good for farming',
              is_correct: true,
              answer_explanation: `The soil around volcanoes is very fertile, which makes it great for farming, even though there's a risk of eruptions.`
             
              
            },

          ]

        },

        {
          question: `Question 10: Which gas is released by volcanoes and can be harmful in large amounts?`,
          points: '10',
          answers: [
            {
              answer_text: 'Oxygen',
              is_correct: false,
             
            },
            {
              answer_text: 'Carbon dioxide',
              is_correct: true,
              answer_explanation: `Volcanoes release carbon dioxide (CO₂), which in large amounts can be harmful to people and the environment.`
            },
            {
              answer_text: 'Helium',
              is_correct: false,
            },
            {
              answer_text: 'Nitrogen',
              is_correct: false,
          
              
            },

          ]

        },


      ]
      
    }
        
    
    
  ];


  try {
    for (const data of quizSeedData) {
      await upsertQuizWithQuestions(data);
    }

  }

  catch (error) {
    console.error("Unexpected error in main loop:", error);
  }


}


main()
  .then(() => {
    console.log("Seeding volcano quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for volcano quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

