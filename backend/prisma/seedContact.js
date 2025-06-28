const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertCountryWithContacts(data) {
  try {
    const existingCountry = await prisma.country.findUnique({
      where: { country_code: data.country_code },
    });

    if (existingCountry) {
      // Update country and emergency contact
      await prisma.country.update({
        where: { country_code: data.country_code },
        data: {
          country_name: data.country_name,
          emergencyContact: {
            // remove old contacts
            deleteMany: {}, 
            // add new contacts
            create: data.emergencyContact,
          },
        },

      });

      console.log(`Updated ${data.country_name}`);

    } 
    
    else {
      // Create country and emergency contact
      await prisma.country.create({
        data: {
          country_name: data.country_name,
          country_code: data.country_code,
          emergencyContact: {
            create: data.emergencyContact,
          },
        },

      });
      
      console.log(`Created ${data.country_name}`);

    }

  }

  catch (error) {
    console.error(`Error upserting disaster '${data.country_name}':`, error);

  }


}

async function main() {
  const seedData = [
    {
      country_name: "United States",
      country_code: "US",
      emergencyContact: [
        {
          police: "911",
          fire: "911",
          medical: "911",
          description: "General emergency numbers for United States",
          safety_guidelines: "Follow local alerts (NOAA, FEMA); use FEMA app for real-time updates. Maintain go-bag (3 days worth of food/water, meds, docs, flashlight). Plan evacuation routes, practice drills, back-up contacts."
        },
      ],
    },
    
    {
      country_name: "United Kingdom",
      country_code: "UK",
      emergencyContact: [
        {
          police: "999",
          fire: "999",
          medical: "999",
          description: "General emergency numbers for United Kingdom",
          safety_guidelines: "Consult GOV.UK and prepare for tailored hazard advice. Emergency response guided by Civil Contingencies Act. Community plans: know roles, shelters, evacuation steps."
        },
      ],
    },

    {
      country_name: "Canada",
      country_code: "CA",
      emergencyContact: [
        {
          police: "911",
          fire: "911",
          medical: "911",
          description: "General emergency numbers for Canada",
          safety_guidelines: "Create 72 hour emergency kit + family preparedness plan. Use Public Safety Canada resources and include medical/insurance info. Coordinate locally via provincial programs."
        },
      ],
    },

    {
      country_name: "Australia",
      country_code: "AU",
      emergencyContact: [
        {
          police: "000",
          fire: "000",
          medical: "000",
          description: "General emergency numbers for Australia",
          safety_guidelines: "Follow Australian Disaster Preparedness Framework via NEMA. Prepare household plans with Red Cross and Services Australia. Understand state-level info (e.g. ACT bushfire preparedness)."
        },
      ],
    },

    {
      country_name: "Germany",
      country_code: "DE",
      emergencyContact: [
        {
          police: "110",
          fire: "112",
          medical: "112",
          description: "General emergency numbers for Germany",
          safety_guidelines: "Prepare a basic emergency kit and practice communication methods that don't rely on radios (like hand signals, pre-arranged codes, or written messages). Stay tuned to local broadcast warnings."
        },
      ],
    },

    {
      country_name: "France",
      country_code: "FR",
      emergencyContact: [
        {
          police: "17",
          fire: "18",
          medical: "15",
          description: "General emergency numbers for France",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Monitor local alerts (radio, TV, mobile apps). Use civil protection websites for geo specific tips"
        },
      ],
    },

    {
      country_name: "Italy",
      country_code: "IT",
      emergencyContact: [
        {
          police: "112",
          fire: "115",
          medical: "118",
          description: "General emergency numbers for Italy",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Monitor local alerts (radio, TV, mobile apps). Use civil protection websites for geo specific tips"
        },
      ],
    },

    {
      country_name: "Spain",
      country_code: "ES",
      emergencyContact: [
        {
          police: "112",
          fire: "112",
          medical: "112",
          description: "General emergency numbers for Spain",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Monitor local alerts (radio, TV, mobile apps). Use civil protection websites for geo specific tips"
        },
      ],
    },

    {
      country_name: "Japan",
      country_code: "JP",
      emergencyContact: [
        {
          police: "110",
          fire: "119",
          medical: "119",
          description: "General emergency numbers for Japan",
          safety_guidelines: "Practice and know how to “Drop, Cover, and Hold On” during an earthquake. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Teach all family members how to respond in different scenarios (e.g., power outages, structural damage, flash floods). Use official alert systems that delivers real-time emergency broadcasts via TV, radio, mobile phones, and loudspeakers."
        },
      ],
    },

    {
      country_name: "South Korea",
      country_code: "SK",
      emergencyContact: [
        {
          police: "112",
          fire: "119",
          medical: "119",
          description: "General emergency numbers for South Korea",
          safety_guidelines: "Practice and know how to “Drop, Cover, and Hold On” during an earthquake. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Teach all family members how to respond in different scenarios (e.g., power outages, structural damage, flash floods). Use official alert systems that delivers real-time emergency broadcasts via TV, radio, mobile phones, and loudspeakers."
        },
      ],
    },

    {
      country_name: "Taiwan",
      country_code: "TW",
      emergencyContact: [
        {
          police: "110",
          fire: "119",
          medical: "119",
          description: "General emergency numbers for Taiwan",
          safety_guidelines: "Practice and know how to “Drop, Cover, and Hold On” during an earthquake. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Teach all family members how to respond in different scenarios (e.g., power outages, structural damage, flash floods). Use official alert systems that delivers real-time emergency broadcasts via TV, radio, mobile phones, and loudspeakers."
        },
      ],
    },

    {
      country_name: "Singapore",
      country_code: "SG",
      emergencyContact: [
        {
          police: "999",
          fire: "995",
          medical: "995",
          description: "General emergency numbers for Singapore",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Indonesia",
      country_code: "ID",
      emergencyContact: [
        {
          police: "110",
          fire: "113",
          medical: "118",
          description: "General emergency numbers for Indonesia",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Malaysia",
      country_code: "MY",
      emergencyContact: [
        {
          police: "999",
          fire: "999",
          medical: "999",
          description: "General emergency numbers for Malaysia",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "China",
      country_code: "CN",
      emergencyContact: [
        {
          police: "110",
          fire: "119",
          medical: "120",
          description: "General emergency numbers for China",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Hong Kong",
      country_code: "HK",
      emergencyContact: [
        {
          police: "999 or 112",
          fire: "+852 2735 3355",
          medical: "+852 2735 3355",
          description: "General emergency numbers for China",
          safety_guidelines: "Follow Hong Kong Observatory (HKO) for real-time warnings. Prepare an Emergency kit that include water, non-perishable food, torch, radio, power bank, important documents. Tape all the windows at home and avoid going outside during black rainstorm or typhoon signal 8+. Use MyObservatory app for push notifications and preparedness tips"

        },
      ],
    },

    {
      country_name: "Philippines",
      country_code: "PH",
      emergencyContact: [
        {
          police: "117",
          fire: "911",
          medical: "911",
          description: "General emergency numbers for Philippines",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Thailand",
      country_code: "TH",
      emergencyContact: [
        {
          police: "191",
          fire: "199",
          medical: "1669",
          description: "General emergency numbers for Thailand",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Vietnam",
      country_code: "VN",
      emergencyContact: [
        {
          police: "113",
          fire: "114",
          medical: "115",
          description: "General emergency numbers for Vietnam",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Cambodia",
      country_code: "KH",
      emergencyContact: [
        {
          police: "117",
          fire: "118",
          medical: "119",
          description: "General emergency numbers for Cambodia",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },
    
    {
      country_name: "Myanmar",
      country_code: "MM",
      emergencyContact: [
        {
          police: "199",
          fire: "191",
          medical: "192",
          description: "General emergency numbers for Myanmar",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow national agencies via mobile alerts. Keep digital copies of documents."
        },
      ],
    },

    {
      country_name: "Brazil",
      country_code: "BR",
      emergencyContact: [
        {
          police: "190",
          fire: "193",
          medical: "192",
          description: "General emergency numbers for Brazil",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow and use local alerts/mobile apps. Keep digital copies of documents and insurance."
        },
      ],
    },

    {
      country_name: "Mexico",
      country_code: "MX",
      emergencyContact: [
        {
          police: "911",
          fire: "911",
          medical: "911",
          description: "General emergency numbers for Mexico",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow and use local alerts/mobile apps. Keep digital copies of documents and insurance."
        },
      ],
    },

    {
      country_name: "Russia",
      country_code: "RU",
      emergencyContact: [
        {
          police: "102",
          fire: "101",
          medical: "103",
          description: "General emergency numbers for Russia",
          safety_guidelines: "Follow МЧС (EMERCOM) guidance. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and know where is the nearest evacuation centers. Use official emergency SMS and media broadcasts."
        },
      ],
    },

    {
      country_name: "New Zealand",
      country_code: "NZ",
      emergencyContact: [
        {
          police: "111",
          fire: "111",
          medical: "111",
          description: "General emergency numbers for New Zealand",
          safety_guidelines: "Practice and know how to “Drop, Cover, and Hold On” during an earthquake. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Teach all family members how to respond in different scenarios (e.g., power outages, structural damage, flash floods). Use official alert systems that delivers real-time emergency broadcasts via TV, radio, mobile phones, and loudspeakers."
        },
      ],
    },

    {
      country_name: "Pakistan",
      country_code: "PK",
      emergencyContact: [
        {
          police: "15",
          fire: "16",
          medical: "115",
          description: "General emergency numbers for Pakistan",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."

        },
      ],
    },

    {
      country_name: "Argentina",
      country_code: "AR",
      emergencyContact: [
        {
          police: "911",
          fire: "100",
          medical: "107",
          description: "General emergency numbers for Argentina",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow and use local alerts/mobile apps. Keep digital copies of documents and insurance."
        },
      ],
    },

    {
      country_name: "Chile",
      country_code: "CL",
      emergencyContact: [
        {
          police: "133",
          fire: "132",
          medical: "131",
          description: "General emergency numbers for Chile",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow and use local alerts/mobile apps. Keep digital copies of documents and insurance."
        },
      ],
    },

    {
      country_name: "Egypt",
      country_code: "EG",
      emergencyContact: [
        {
          police: "122",
          fire: "180",
          medical: "123",
          description: "General emergency numbers for Egypt",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },
    
    {
      country_name: "Turkey",
      country_code: "TR",
      emergencyContact: [
        {
          police: "155",
          fire: "110",
          medical: "112",
          description: "General emergency numbers for Turkey",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Saudi Arabia",
      country_code: "SA",
      emergencyContact: [
        {
          police: "999",
          fire: "998",
          medical: "997",
          description: "General emergency numbers for Saudi Arabia",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Kuwait",
      country_code: "KW",
      emergencyContact: [
        {
          police: "112",
          fire: "1800800",
          medical: "112",
          description: "General emergency numbers for Kuwait",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },
    
    {
      country_name: "Qatar",
      country_code: "QA",
      emergencyContact: [
        {
          police: "999",
          fire: "997",
          medical: "999",
          description: "General emergency numbers for Qatar",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },
    
    {
      country_name: "United Arab Emirates",
      country_code: "AE",
      emergencyContact: [
        {
          police: "999",
          fire: "997",
          medical: "998",
          description: "General emergency numbers for United Arab Emirates",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Israel",
      country_code: "IL",
      emergencyContact: [
        {
          police: "100",
          fire: "102",
          medical: "101",
          description: "General emergency numbers for Israel",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Bangladesh",
      country_code: "BD",
      emergencyContact: [
        {
          police: "999",
          fire: "999",
          medical: "199",
          description: "General emergency numbers for Bangladesh",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Nigeria",
      country_code: "NG",
      emergencyContact: [
        {
          police: "112",
          fire: "112",
          medical: "112",
          description: "General emergency numbers for Nigeria",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    {
      country_name: "Sri Lanka",
      country_code: "LK",
      emergencyContact: [
        {
          police: "119",
          fire: "110",
          medical: "110",
          description: "General emergency numbers for Sri Lanka",
          safety_guidelines: "Stay tuned to national advice channels and prepare for water and heat protection. Know what the evacuation and relocation contacts."
        },
      ],
    },

    
    {
      country_name: "Colombia",
      country_code: "CO",
      emergencyContact: [
        {
          police: "123",
          fire: "119",
          medical: "125",
          description: "General emergency numbers for Colombia",
          safety_guidelines: "Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies and evacuate when instructed. Follow and use local alerts/mobile apps. Keep digital copies of documents and insurance."
        },
      ],
    },

    {
      country_name: "India",
      country_code: "IN",
      emergencyContact: [
        {
          police: "100",
          fire: "101",
          medical: "102",
          description: "General emergency numbers for Colombias",
          safety_guidelines: "Practice and know how to “Drop, Cover, and Hold On” during an earthquake. Prepare an emergency kit with essentials like water, food, flashlight, and first-aid supplies. Know your evacuation routes and the locations of nearby emergency shelters. Teach all family members how to respond in different scenarios (e.g., power outages, structural damage, flash floods). Use official alert systems that delivers real-time emergency broadcasts via TV, radio, mobile phones, and loudspeakers."
        },
      ],
    },
   
  ];

  try {
    for (const data of seedData) {
      await upsertCountryWithContacts(data);
    }

  }

  catch (error) {
    console.error("Unexpected error in main loop:", error);
  }


}

main()
  .then(() => {
    console.log("Seeding contacts complete.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seeding error for contacts:", e);
    prisma.$disconnect();
    process.exit(1);
  });
