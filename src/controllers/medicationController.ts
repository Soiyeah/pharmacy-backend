import { Request as ExpressRequest, Response } from "express";
import { db } from "../database";

interface Request extends ExpressRequest {
  user?: { role: string };
}

export const getAllMedications = (req: Request, res: Response) => {
  db.all("SELECT * FROM medications WHERE deleted = 0", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

export const getMedicationById = (req: Request, res: Response) => {
  console.log(req.params);

  const id = parseInt(req.params.id);
  db.get(
    "SELECT * FROM medications WHERE id = ? AND deleted = 0",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ message: "Medication not found" });
        return;
      }
      res.json(row);
    }
  );
};

export const addMedication = (req: Request, res: Response) => {
  console.log("Request " + req);
  const userRole = req.user?.role;
  console.log(req.user);
  if (userRole !== "owner") {
    return res
      .status(403)
      .json({ error: "Only the owner can add medications" });
  }
  const { name, description, quantity } = req.body;
  db.run(
    "INSERT INTO medications (name, description, quantity) VALUES (?, ?, ?)",
    [name, description, quantity],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
};

export const updateMedication = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (
    userRole !== "owner" &&
    userRole !== "manager" &&
    userRole !== "cashier"
  ) {
    return res
      .status(403)
      .json({ error: "Only the owner and manager can update medications" });
  }
  const id = parseInt(req.params.id);
  const { name, description, quantity } = req.body;
  db.run(
    "UPDATE medications SET name = ?, description = ?, quantity = ? WHERE id = ?",
    [name, description, quantity, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Medication updated successfully" });
    }
  );
};

export const softDeleteMedication = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (userRole !== "owner" && userRole !== "manager") {
    return res.status(403).json({
      error: "Only the owner and manager can soft delete medications",
    });
  }
  const id = parseInt(req.params.id);
  db.run(
    "UPDATE medications SET deleted = 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Medication soft deleted successfully" });
    }
  );
};

export const deleteMedication = (req: Request, res: Response) => {
  const userRole = req.user?.role;
  if (userRole !== "owner") {
    return res.status(403).json({
      error: "Only the owner can permanently delete medications",
    });
  }
  const id = parseInt(req.params.id);
  db.run("DELETE FROM medications WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Medication permanently deleted successfully" });
  });
};
