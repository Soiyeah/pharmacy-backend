import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  softDeleteCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { authorize } from "../middleware/authorization";

const router = express.Router();

router.get("/", authorize, getAllCustomers);
router.get("/:id", authorize, getCustomerById);
router.post("/", authorize, addCustomer);
router.put("/:id", authorize, updateCustomer);
router.delete("/:id", authorize, softDeleteCustomer);
router.delete("/permanent/:id", authorize, deleteCustomer);

export default router;
