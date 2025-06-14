import { prisma } from "../../app/lib/prisma/client";

export class TestService {
  async testExecute() {
    try {
      const result = await prisma.booking.findMany();
      return result.length;
    } catch(e) {
      return 'error!' + (e as any).message;
    }
  }
}