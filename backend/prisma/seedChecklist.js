const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function upsertDisasterWithChecklist(data) {
    try {
        const existingDisaster = await prisma.disaster.findUnique({
            where: { disaster_name: data.disaster_name },
            include: {
                title: { include: { templates: true } },
            },

        });

        if (existingDisaster) {
            // Delete all related checklist titles and templates 
            for (const title of existingDisaster.title) {
                await prisma.checklistTemplate.deleteMany({
                    where: { title_id: title.title_id },

                });

            }

            await prisma.checklistTitle.deleteMany({
                where: { disaster_id: existingDisaster.disaster_id },

            });

            console.log(`Deleted checklist titles and templates for ${data.disaster_name}`);

            // Re-create checklist titles and templates
            for (const titleData of data.title) {
                await prisma.checklistTitle.create({
                    data: {
                        disaster_id: existingDisaster.disaster_id,
                        title: titleData.title,
                        templates: {
                            create: titleData.templates,
                        },

                    },

                });

                console.log(`Created title '${titleData.title}' with ${titleData.templates.length} templates`);

            }

        }

        else {
            // Create disaster with nested checklist titles and templates
            const newDisaster = await prisma.disaster.create({
                data: {
                    disaster_name: data.disaster_name,
                    title: {
                        create: data.title.map((titleData) => ({
                            title: titleData.title,
                            templates: {
                                create: titleData.templates,
                            },

                        })),

                    },
                },

            });

            console.log(`Created new disaster '${newDisaster.disaster_name}' with ${data.title.length} checklist titles`);

        }

        console.log(`Upsert completed for disaster: ${data.disaster_name}`);

    }

    catch (error) {
        console.error(`Error upserting disaster '${data.disaster_name}':`, error);
    }



}



async function main() {
    const seedData = [
        {
            disaster_name: 'Earthquake',
            title: [
                {
                    title: 'Home Safety & Planning For Earthquake',
                    templates: [
                        { checklist_item: 'Secure heavy furniture (bookshelves, TVs, cabinets) to walls.' },
                        { checklist_item: 'Store breakables in low or closed cabinets with latches.' },
                        { checklist_item: 'Identify safe spots in each room: under sturdy furniture, away from windows.' },
                        { checklist_item: 'Practice "Drop, Cover, and Hold On" drills regularly with family.' },
                        { checklist_item: 'Plan and practice evacuation routes.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Earthquake Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'Whistle to signal for help' },
                        { checklist_item: 'Dust masks or N95s' },
                    ],
                },

                {
                    title: 'During an Earthquake',
                    templates: [
                        { checklist_item: 'DROP to your hands and knees when in indoor.' },
                        { checklist_item: 'COVER your head and neck under a sturdy table or desk when in indoor.' },
                        { checklist_item: 'HOLD ON until shaking stops when in indoor.' },
                        { checklist_item: 'Do NOT run outside until the shaking stops when in indoor.' },
                        { checklist_item: 'Stay away from windows, mirrors, glass, and heavy objects.' },
                    ],
                },

                
                {
                    title: 'After an Earthquake',
                    templates: [
                        { checklist_item: 'Be prepared for aftershocks.' },
                        { checklist_item: 'Avoid using elevators.' },
                        { checklist_item: 'Listen to local authorities via radio/phone for updates.' },
                        { checklist_item: 'If your home is unsafe, evacuate calmly and go to a designated shelter.' },
                        { checklist_item: 'Check yourself and others for injuries.' },
                    ],
                },

            ],

        },

        {
            disaster_name: 'Flood',
            title: [
                {
                    title: 'Home Safety & Planning For Flood',
                    templates: [
                        { checklist_item: 'Identify your house evacuation routes and nearest higher ground.' },
                        { checklist_item: 'Know your local flood risk (check flood maps if available).' },
                        { checklist_item: 'Elevate electrical appliances and sockets above expected flood levels.' },
                        { checklist_item: 'Keep important documents (IDs, insurance papers, property deeds) in a waterproof container.' },
                        { checklist_item: 'Practice family emergency plans and evacuation drills.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Flood Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'Whistle to signal for help' },
                        { checklist_item: 'Copies of important documents in waterproof containers' },

                    ],
                },

                {
                    title: 'During a Flood',
                    templates: [
                        { checklist_item: 'Move to the highest floor or rooftop if water rises when in indoor.' },
                        { checklist_item: 'Avoid walking or driving through floodwaters (as little as 6 inches can knock you down, 1 foot can sweep away a car).' },
                        { checklist_item: 'Disconnect electrical appliances if safe.' },
                        { checklist_item: 'Keep listening to official weather alerts and evacuation orders.' },

                    ],
                },

                {
                    title: 'After a Flood',
                    templates: [
                        { checklist_item: 'Stay away from floodwater — it may be contaminated or electrically charged.' },
                        { checklist_item: 'Avoid returning home until authorities declare it safe.' },
                        { checklist_item: 'Check for structural damage before entering your home.' },
                        { checklist_item: 'Use protective gear (gloves, boots, masks) during cleanup.' },

                    ],
                },


            ],

        },

        {
            disaster_name: 'Tropical Cyclone',
            title: [
                {
                    title: 'Home Safety & Planning For Tropical Cyclone',
                    templates: [
                        { checklist_item: 'Know your community evacuation routes and nearest shelters.' },
                        { checklist_item: 'Monitor official weather updates and storm warnings via TV, radio, or disaster apps.' },
                        { checklist_item: 'Identify safe rooms or areas in your house (preferably windowless interior rooms or basements).' },
                        { checklist_item: 'Reinforce windows (install storm shutters or board up with plywood).' },
                        { checklist_item: 'Secure outdoor objects (furniture, tools, plants) that can be blown away.' },
                        { checklist_item: 'Clear gutters and drains to reduce flooding.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Tropical Cyclone Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'Whistle to signal for help' },
                        { checklist_item: 'Copies of important documents in waterproof containers' },

                    ],
                },

                {
                    title: 'During a Tropical Cyclone',
                    templates: [
                        { checklist_item: 'Stay indoors, away from windows and glass doors.' },
                        { checklist_item: 'Keep listening to official updates and instructions.' },
                        { checklist_item: 'Do not go outside during the calm “eye of the storm” — strong winds will resume quickly from the opposite direction.' },

                    ],
                },

                {
                    title: 'After a Tropical Cyclone',
                    templates: [
                        { checklist_item: 'Wait for official announcements before leaving shelter or home.' },
                        { checklist_item: 'Watch out for fallen power lines, unstable trees, debris, and floodwaters.' },
                        { checklist_item: 'Avoid floodwaters — they can be contaminated or electrically charged.' },
                        { checklist_item: 'Monitor updates about after-storm hazards like landslides or flash floods.' },

                    ],
                },


            ],

        },

        {
            disaster_name: 'Volcano',
            title: [
                {
                    title: 'Home Safety & Planning For Volcano',
                    templates: [
                        { checklist_item: 'Know if you live in a volcanic hazard zone (check local hazard maps).' },
                        { checklist_item: 'Learn your community’s evacuation routes and emergency shelters.' },
                        { checklist_item: 'Stay informed about volcano activity through local authorities and geological agencies.' },
                        { checklist_item: 'Prepare a family emergency communication plan (meeting points, contacts).' },
                        { checklist_item: 'Understand warning signals and evacuation orders.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Volcano Eruption Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'Whistle to signal for help' },
                        { checklist_item: 'N95 masks or respirators to protect from ash inhalation' },
                        { checklist_item: 'Goggles to protect eyes from ash' },
                        { checklist_item: 'Sturdy shoes and protective clothing (long sleeves and pants to prevent skin irritation)' },

                    ],
                },

                {
                    title: 'During a Volcanic Eruption',
                    templates: [
                        { checklist_item: 'Follow evacuation orders immediately.' },
                        { checklist_item: 'Stay indoors if you cannot evacuate, keeping windows and doors closed.' },
                        { checklist_item: 'Use masks and goggles to protect your lungs and eyes from ash.' },
                        { checklist_item: 'Avoid low-lying areas where lava flows or mudflows (lahars) may travel.' },

                    ],
                },

                {
                    title: 'After a Volcanic Eruption',
                    templates: [
                        { checklist_item: 'Avoid areas downwind or downstream from the volcano and watch for lahars.' },
                        { checklist_item: 'Clean ash from roofs carefully to prevent collapse (use masks and protective clothing).' },
                        { checklist_item: 'Stay updated with local authorities about safety and re-entry.' },
                        { checklist_item: 'Use damp cloths to clean surfaces indoors.' },

                    ],
                },


            ],

        },

        {
            disaster_name: 'Drought',
            title: [
                {
                    title: 'Home Safety & Planning For Drought',
                    templates: [
                        { checklist_item: 'Learn your area drought risk and local water restrictions.' },
                        { checklist_item: 'Store an emergency water supply' },
                        { checklist_item: 'Install water-saving devices (low-flow faucets, toilets, and showerheads).' },
                        { checklist_item: 'Collect rainwater (if permitted in your area) for non-drinking use.' },
                        { checklist_item: 'Know how your local water authority communicates drought warnings and rules.' },
                        { checklist_item: 'Prepare a household plan for conserving water during stricter restrictions.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Drought Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'Stored drinking water' },
                        { checklist_item: 'Non-perishable food (especially foods that require little or no water to prepare)' },
                        { checklist_item: 'Basic hygiene supplies (including dry shampoo, sanitizing wipes)' },
                        { checklist_item: 'Water purification tablets or filters (in case you must use alternative sources)' },
                        { checklist_item: 'Face masks (for dust in extreme drought conditions)' },

                    ],
                },

                {
                    title: 'During a Drought',
                    templates: [
                        { checklist_item: 'Follow all local water use restrictions (watering lawns, washing cars, etc.).' },
                        { checklist_item: 'Take shorter showers and avoid unnecessary water use.' },
                        { checklist_item: 'Reuse water when safe (e.g., from rinsing veggies to watering plants).' },

                    ],
                },

                {
                    title: 'After a Drought',
                    templates: [
                        { checklist_item: 'Continue water-saving habits — droughts may return or continue seasonally.' },
                        { checklist_item: 'Check plumbing and water systems for any damage due to dryness or stress.' },
                        { checklist_item: 'Reassess household emergency water plans based on recent experience.' },

                    ],
                },


            ],

        },

        {
            disaster_name: 'Tsunami',
            title: [
                {
                    title: 'Home Safety & Planning For Tsunami',
                    templates: [
                        { checklist_item: 'Know if your home, school, or workplace is in a tsunami hazard zone (check local evacuation maps).' },
                        { checklist_item: 'Learn the natural warning signs of a tsunami.' },
                        { checklist_item: 'Know your community evacuation routes and nearest safe areas on high ground.' },
                        { checklist_item: 'Plan multiple escape routes in case some roads are blocked.' },
                        { checklist_item: 'Practice tsunami evacuation drills with family or coworkers.' },
                        { checklist_item: 'Save emergency contact numbers and local tsunami alert services.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Tsunami Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'Important documents in waterproof bags' },
                        { checklist_item: 'Sturdy shoes and protective clothing' },
                        { checklist_item: 'Emergency whistle and small signaling mirror' },

                    ],
                },

                {
                    title: 'During a Tsunami Warning',
                    templates: [
                        { checklist_item: 'If you feel a strong coastal earthquake, evacuate immediately — do not wait for official warnings.' },
                        { checklist_item: 'Move quickly to higher ground (at least 30 meters/100 feet above sea level) or as far inland as possible.' },
                        { checklist_item: 'Stay away from beaches, rivers, and low-lying coastal areas.' },
                        { checklist_item: 'Follow official evacuation orders without delay.' },
                        { checklist_item: 'Listen to official announcements via radio, mobile apps, or disaster management systems.' },

                    ],
                },

                {
                    title: 'After a Tsunami',
                    templates: [
                        { checklist_item: 'Wait for the official “All Clear” announcement before returning — tsunamis often come in multiple waves hours apart.' },
                        { checklist_item: 'Stay away from damaged buildings, flooded areas, and unstable shorelines.' },
                        { checklist_item: 'Avoid walking or driving through floodwaters — they can be dangerous and contaminated.' },
                        { checklist_item: 'Stay updated on local news for further tsunami warnings, aftershocks, or hazards.' },
                        { checklist_item: 'Be cautious of potential outbreaks of waterborne diseases.' },

                    ],
                },


            ],

        },

        {
            disaster_name: 'Forest Fire',
            title: [
                {
                    title: 'Home Safety & Planning For Forest Fire',
                    templates: [
                        { checklist_item: 'Know if your area is at risk for forest fires (check local hazard maps or fire advisories).' },
                        { checklist_item: 'Learn your community evacuation routes and nearby safe shelters.' },
                        { checklist_item: 'Sign up for local emergency alerts and wildfire warnings.' },
                        { checklist_item: 'Prepare a family emergency communication and evacuation plan.' },
                        { checklist_item: 'Clear dead leaves, twigs, and other flammable debris from roofs, gutters, and yards.' },
                        { checklist_item: 'Install spark arrestors on chimneys and stovepipes.' },
                        { checklist_item: 'Use fire-resistant roofing and building materials where possible.' },
                    ],
                },

                {
                    title: 'Emergency Supplies (Forest Fire Go-Bag/Kit)',
                    templates: [
                        { checklist_item: 'First aid kit and essential medications' },
                        { checklist_item: 'N95 masks to protect from smoke inhalation' },
                        { checklist_item: 'Goggles or safety glasses to protect eyes from smoke and ash' },
                        { checklist_item: 'Emergency whistle and small signaling mirror' },
                        { checklist_item: 'Important documents in waterproof bags' },

                    ],
                },

                {
                    title: 'During a Forest Fire',
                    templates: [
                        { checklist_item: 'Follow evacuation orders without delay.' },
                        { checklist_item: 'Turn off gas and propane at the source.' },
                        { checklist_item: 'Close all windows and doors but leave them unlocked.' },
                        { checklist_item: 'Wear protective clothing: long sleeves, pants, boots, mask, and goggles.' },
                        { checklist_item: 'If trapped, take shelter inside a building, away from outside walls and windows.' },
                        { checklist_item: 'Avoid using vehicles unless necessary — roads can quickly become blocked.' },
                        { checklist_item: 'Monitor official announcements on radio, apps, or social media.' },

                    ],
                },

                {
                    title: 'After a Forest Fire',
                    templates: [
                        { checklist_item: 'Do not return home until authorities declare it safe.' },
                        { checklist_item: 'Stay alert for hazards like falling trees, smoldering debris, or damaged power lines.' },
                        { checklist_item: 'Wear masks and protective clothing when cleaning up ash or debris.' },
                        { checklist_item: 'Discard food, water, or medicine exposed to heat, smoke, or soot.' },
                        { checklist_item: 'Watch for health effects from smoke inhalation, and seek medical help if needed.' },
                        { checklist_item: 'Stay informed about potential flare-ups or residual fire risks.' },

                    ],
                },


            ],

        },

    ];
  
    try {
        for (const disaster of seedData) {
            await upsertDisasterWithChecklist(disaster);
        }
    } 
    
    catch (error) {
        console.error("Unexpected error in main loop:", error);
    }

}

main()
    .then(() => {
        console.log("Seeding checklist complete.");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error("Seeding error for checklist:", e);
        prisma.$disconnect();
        process.exit(1);
    });
