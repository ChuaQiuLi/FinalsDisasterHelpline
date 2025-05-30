const express = require('express');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();
const router = express.Router();



router.get('/details', async (req, res) => {

  const { user_id } = req.query;

  try {
    const checklist = await prisma.disaster.findMany({
      select: {
        disaster_id: true,
        disaster_name: true,

        title: {
          select: {
            title_id: true,
            title: true,
            
            templates: {
              select: {
                template_id: true,
                checklist_item: true,

              },

            },
        
            checklists: {
              where: {
                user_id: parseInt(user_id),
              },

              select: {
                checklist_id: true,
                checklist_item: true
                    
              },

            },
          
          },

        },

      },


    });

    res.json(checklist);

  }

  catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ error: 'Failed to fetch checklist' });

  }

});




router.get('/user-checklist-status', async (req, res) => {

  const { user_id } = req.query;

  try {
    const checklistStatus = await prisma.userChecklistStatus.findMany({
      where: {
        user_id: parseInt(user_id),
        checklist_id: { not: null }
      },

      select: {
        checklist_id: true, 
        is_checked: true

      },


    });

    res.json(checklistStatus);

  }

  catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ error: 'Failed to fetch checklist' });

  }

});




router.get('/template-checklist-status', async (req, res) => {

  const { user_id } = req.query;

  try {
    const templatetStatus = await prisma.userChecklistStatus.findMany({
      where: {
        user_id: parseInt(user_id),
        template_id: { not: null },
      },

      select: {
        template_id: true, 
        is_checked: true

      },

    });

    res.json(templatetStatus);

  }

  catch (error) {
    console.error('Error fetching checklist status:', error);
    res.status(500).json({ error: 'Failed to fetch checklist status' });

  }

});




router.post('/change-template-checklist-status', async (req, res) => {

  const { user_id, template_id, is_checked } = req.body;

  try {
    const templatetStatus = await prisma.userChecklistStatus.upsert({
      where: {
        user_id_template_id: {
          user_id: user_id,
          template_id: parseInt(template_id)
        }
      },

      update: {
        is_checked: is_checked
      },

      create: {
        user_id: user_id,
        template_id: parseInt(template_id),
        is_checked: is_checked
      }

    });

    res.json(templatetStatus);

  }

  catch (error) {
    console.error('Error updating checklist status:', error);
    res.status(500).json({ error: 'Failed to update checklist status' });

  }

});



router.post('/change-user-checklist-status', async (req, res) => {

  const { user_id, checklist_id, is_checked } = req.body;

  try {
    const templatetStatus = await prisma.userChecklistStatus.upsert({
      where: {
        user_id_checklist_id: {
          user_id: user_id,
          checklist_id: parseInt(checklist_id)
        }
      },

      update: {
        is_checked: is_checked
      },

      create: {
        user_id: user_id,
        checklist_id: parseInt(checklist_id),
        is_checked: is_checked
      }

    });

    res.json(templatetStatus);

  }

  catch (error) {
    console.error('Error updating checklist status:', error);
    res.status(500).json({ error: 'Failed to update checklist status' });

  }

});




router.get('/title', async (req, res) => {

  const { disaster_id } = req.query;

  try {
    const checklistTitle = await prisma.checklistTitle.findMany({
      where: {
        disaster_id: parseInt(disaster_id)

      },

      select: {
        title_id: true,
        title: true
      },


    });

    res.json(checklistTitle);

  }

  catch (error) {
    console.error('Error fetching checklist title:', error);
    res.status(500).json({ error: 'Failed to fetch checklist title' });

  }

});



router.post('/add-checklist-item', async (req, res) => {

  const { user_id, disaster_id, title_id, checklist_item } = req.body;

  try {
    const checklistTitle = await prisma.checklist.create({
      data: {
        user_id: parseInt(user_id),
        disaster_id: parseInt(disaster_id),
        title_id: parseInt(title_id),
        checklist_item: checklist_item.trim()
        
      },

    });

    res.json(checklistTitle);

  }

  catch (error) {
    console.error('Error creating checklist:', error);
    res.status(500).json({ error: 'Failed to create checklist' });

  }

});



router.delete('/delete-user-checklist-item', async (req, res) => {

  const { checklist_id, user_id } = req.query;

  try {

    const checklistExists = await prisma.checklist.findUnique({
      where: { 
        checklist_id: parseInt(checklist_id)
      
      }

    });
    
    if (!checklistExists) {
      return res.status(404).json({ error: 'Checklist not found' });
    }



    // delete related user status if exists
    await prisma.userChecklistStatus.deleteMany({
      where: {
        checklist_id: parseInt(checklist_id),
        user_id: parseInt(user_id),
      },
      
    });


    const deleteChecklistItem = await prisma.checklist.delete({
      where: { 
        checklist_id: parseInt(checklist_id)
      }

    });
    

    res.status(200).json({ message: 'Checklist item deleted successfully', checklist: deleteChecklistItem });
  
  }

  catch (error) {
    console.error('Error deleting checklist item:', error);
    res.status(500).json({ error: 'Failed to delete checklist item' });

  }

});




module.exports = router;