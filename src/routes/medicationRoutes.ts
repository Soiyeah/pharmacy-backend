import express from "express";
import {
  getAllMedications,
  addMedication,
  updateMedication,
  softDeleteMedication,
  deleteMedication,
  getMedicationById,
} from "../controllers/medicationController";
import { authorize } from "../middleware/authorization";

const router = express.Router();

router.get("/", authorize, getAllMedications);
router.get("/:id", authorize, getMedicationById);
router.post("/", authorize, addMedication);
router.put("/:id", authorize, updateMedication);
router.delete("/:id", authorize, softDeleteMedication);
router.delete("/permanent/:id", authorize, deleteMedication);

export default router;
