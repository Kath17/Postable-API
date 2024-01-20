import { NextFunction, Request, Response } from "express";
import * as profileService from "../services/user-profile.service";
import { UserParamsEdit } from "../models/user.model";

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = String(req.userId);
    const userProfile = await profileService.getUserProfileById(userId);

    res.status(200).json({
      ok: true,
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId: string = String(req.userId);
    const data: UserParamsEdit = req.body;
    const updatedProfile = await profileService.updateUserProfile(data, userId);

    res.status(200).json({
      ok: true,
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = String(req.userId);
    const deletedProfile = await profileService.deleteUserProfile(userId);
    res.status(200).json({ ok: true, data: deletedProfile });
  } catch (error) {
    next(error);
  }
}
