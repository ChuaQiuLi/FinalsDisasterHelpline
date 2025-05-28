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
          description: "Separate numbers for services",
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
