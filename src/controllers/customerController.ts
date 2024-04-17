import { Request as ExpressRequest, Response } from "express";
import { db } from "../database";

interface Request extends ExpressRequest {
  user?: { role: string };
}

export const getAllCustomers = (req: Request, res: Response) => {
  db.all("SELECT * FROM customers WHERE deleted = 0", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

export const getCustomerById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  db.get(
    "SELECT * FROM customers WHERE id = ? AND deleted = 0",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.json(row);
    }
  );
};

export const addCustomer = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (userRole !== "owner") {
    return res.status(403).json({ error: "Only the owner can add customers" });
  }

  const { name } = req.body;
  db.run("INSERT INTO customers (name) VALUES (?)", [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
};

export const updateCustomer = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (
    userRole !== "owner" &&
    userRole !== "manager" &&
    userRole !== "cashier"
  ) {
    return res
      .status(403)
      .json({ error: "Only the owner and manager can update customers" });
  }
  const id = parseInt(req.params.id);
  const { name } = req.body;
  db.run(
    "UPDATE customers SET name = ? WHERE id = ?",
    [name, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Customer updated successfully" });
    }
  );
};

export const softDeleteCustomer = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (userRole !== "owner" && userRole !== "manager") {
    return res.status(403).json({
      error: "Only the owner and manager can soft delete customers",
    });
  }
  const id = parseInt(req.params.id);
  db.run("UPDATE customers SET deleted = 1 WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Customer soft deleted successfully" });
  });
};

export const deleteCustomer = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (userRole !== "owner") {
    return res
      .status(403)
      .json({ error: "Only the owner can permanently delete customers" });
  }
  const id = parseInt(req.params.id);
  db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Customer permanently deleted successfully" });
  });
};
