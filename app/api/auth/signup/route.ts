import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name, userType, companyName, businessPhone, address } = await req.json();

    // Validate required fields
    if (!email || !password || !userType) {
      console.log("Missing required fields:", { email, password, userType });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate partner-specific fields
    if (userType === "partner") {
      if (!companyName || !businessPhone || !address) {
        console.log("Missing partner fields:", { companyName, businessPhone, address });
        return NextResponse.json(
          { error: "Missing partner information" },
          { status: 400 }
        );
      }
    }

    // Validate customer-specific fields
    if (userType === "customer" && !name) {
      console.log("Missing customer name");
      return NextResponse.json(
        { error: "Name is required for customers" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.customer.findUnique({ where: { email } });
    const existingPartner = await prisma.partner.findUnique({ where: { email } });

    if (existingUser || existingPartner) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザーの作成
    if (userType === "customer") {
      const customer = await prisma.customer.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      return NextResponse.json({ message: "Customer created successfully" });
    } else if (userType === "partner") {
      const partner = await prisma.partner.create({
        data: {
          email,
          password: hashedPassword,
          companyName,
          businessPhone,
          address,
        },
      });
      return NextResponse.json({ message: "Partner created successfully" });
    } else {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating user", details: error.message },
      { status: 500 }
    );
  }
} 