const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");
const mongoose = require("mongoose");

const User = require("../models/user");
const CourseVideo = require("../models/coursevideos");
const Enrolls = require("../models/enrolls");
const Reviews = require("../models/reviews");
const Category = require("../models/category");
const Course = require("../models/course");

AdminBro.registerAdapter(AdminBroMongoose);

const express = require("express");
const app = express();

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    companyName: "BestBags",
    logo: "/images/shop-icon.png",
    softwareBrothers: false,
  },
  resources: [
    {
      resource: Course,
      options: {
        parent: {
          name: "Admin Content",
          icon: "InventoryManagement",
        },
        properties: {
         
          title: {
            isTitle:true ,
          },
          price: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          description: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
           
          tutor_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
    
      
        
        },
      },
    },
 
 
    {
      resource: User,
      options: {
        parent: {
          name: "User Content",
          icon: "User",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          username: {
          
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          password: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          email: {
            
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          phone: {
          
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
         
         
        },
      },
    },
    {
      resource: Category,
      options: {
        parent: {
          name: "Admin Content",
          icon: "User",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          slug: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          title: {
            isTitle: true,
          },
          
        },
      },
    },
    {
      resource: Reviews,
      options: {
        parent: {
          name: "Admin Content",
          icon: "User",
        },
        properties: {
         
          courseId: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          }
          
         
          
        },
      },
    },
    {
      resource: CourseVideo,
      options: {
        parent: {
          name: "Admin Content",
          icon: "User",
        },
      },
    },
    {
      resource: Enrolls,
      options: {
        parent: {
          name: "User Content",
          icon: "User",
        },
        properties: {
          edit:false
        }
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        loginWelcome: "Admin Panel Login",
      },
      messages: {
        loginWelcome:
          "Please enter your credentials to log in and manage your website contents",
      },
    },
  },
  dashboard: {
    component: AdminBro.bundle("../components/admin-dashboard-component.jsx"),
  },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN;
    }
    return null;
  },
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
});

module.exports = router;
