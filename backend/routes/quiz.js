const express = require('express');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();
const router = express.Router();


router.get('/details', async (req, res) => {

  const { user_id } = req.query;

  try {
    const quiz = await prisma.disaster.findMany({
      select: {
        disaster_id: true,
        disaster_name: true,

        quiz: {
          select: {
            quiz_id: true,
            quiz_title: true,
            quiz_description: true,
            difficulty_level: true,
            
            quizResults: {
              where: {
                user_id: parseInt(user_id),
              },

              select: {
                result_id: true,
                score: true
              },

            },

            quizQuestions: {
              select: {
                question_id: true,
                question: true,
                points: true,

                quizAnswer: {
                  select: {
                    answer_id: true,
                    answer_text: true,
                  }

                }

              },

            },
          
          },

        },

      },


    });

    res.json(quiz);

  }

  catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });

  }

});



router.get('/check-answer', async (req, res) => {

  const { quiz_id, question_id, answer_id } = req.query;


  if (!quiz_id || !question_id || !answer_id) {
    return res.status(400).json({ error: 'Missing quiz_id, question_id, or answer_id' });

  }

  try {
    const answer = await prisma.quizAnswer.findFirst({
      where: {
        question_id: parseInt(question_id),
        answer_id: parseInt(answer_id),

        question: {
          quiz_id: parseInt(quiz_id),
        }

      },

      select: {
        is_correct: true,
        answer_explanation: true,
      }


    });


    if (!answer) {
      return res.status(404).json({ error: 'Answer not found for this question' });
    }

    res.json(answer);

  }

  catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz answer' });

  }

});


router.post('/save-score', async (req, res) => {

  const { user_id, quiz_id, score } = req.body;


  if (!user_id || !quiz_id || !score) {
    return res.status(400).json({ error: 'Missing quiz_id, question_id, or answer_id' });

  }

  try {
    await prisma.quizResults.upsert({
      where: {
        user_id_quiz_id: {
          user_id: parseInt(user_id),
          quiz_id: parseInt(quiz_id),

        },

      },

      update: {
        score: score,

      },

      create: {
        user_id: parseInt(user_id),
        quiz_id: parseInt(quiz_id),
        score: score

      },


    });
    
    
    // Fetch the quiz based on quiz_id
    const quiz = await prisma.quiz.findUnique({
      where: { quiz_id: parseInt(quiz_id) },
    });


    // Determine the badge based on quiz title 
    if (score === 100 && quiz) {
      const badge = await prisma.badge.findFirst({
        where: {
          badge_name: {
            contains: quiz.title, 
            // case-insensitive
            mode: 'insensitive'   
          }
        }

      });


      if (badge) {
        await prisma.userBadge.upsert({
          where: {
            user_id_badge_id: {
              user_id: parseInt(user_id),
              badge_id: badge.badge_id,
            }

          },

          update: {}, 
          create: {
            user_id: parseInt(user_id),
            badge_id: badge.badge_id,

          }

        });


      }

    }


    res.status(200).json({ message: 'Score and badge saved successfully' });

  }

  catch (error) {
    console.error('Error creating score and badge:', error);
    res.status(500).json({ error: 'Failed to create score and badge' });

  }

});



module.exports = router;
