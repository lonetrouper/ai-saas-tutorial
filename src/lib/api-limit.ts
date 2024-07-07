import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_COUNTS } from "@/constants";
import prismadb from "@/lib/prismadb";

export const increaseApiLimit = async () => {
  const { userId } = auth();
  if (!userId) {
    return;
  }
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });
  console.log("increaseApiLimit");
  if (userApiLimit) {
    console.log("if block");
    await prismadb.userApiLimit.update({
      where: {
        userId: userId,
      },
      data: {
        count: userApiLimit.count + 1,
      },
    });
  } else {
    console.log("else block");
    await prismadb.userApiLimit.create({
      data: {
        userId: userId,
        count: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });
  console.log(userApiLimit);
  if (userApiLimit) {
    if (userApiLimit.count >= MAX_FREE_COUNTS) {
      return false;
    }
  }
  return true;
};

export const getApiLimitCount = async () => {
  const { userId } = auth();
  if (!userId) {
    return 0;
  }
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!userApiLimit) {
    return 0;
  }
  return userApiLimit.count;
};
