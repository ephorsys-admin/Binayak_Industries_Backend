import dotenv from "dotenv";
dotenv.config();

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import connectToDb from "../config/db/db.js";
import AdminModel from "../models/admin.model.js";

const createSuperAdmin = async () => {
    try {
        await connectToDb();

        const existingAdmin = await AdminModel.findOne({
            email: "superadmin@gmail.com",
        });

        if (existingAdmin) {
            console.log("Super Admin already exists");
            process.exit(0);
        }

        await AdminModel.create({
            name: process.env.SUPER_ADMIN_NAME,
            email: process.env.SUPER_ADMIN_EMAIL,
            password: process.env.SUPER_ADMIN_PASSWORD,
            role: process.env.SUPER_ADMIN_ROLE,
        });

        console.log("Super Admin Created Successfully");

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

createSuperAdmin();
