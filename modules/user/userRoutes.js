const express = require('express');
const { createUser, updateUser, deleteUser } = require('./scimService');
const router = express.Router();

router.post('/scim/create', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/scim/update/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/scim/delete/:id', async (req, res) => {
  try {
    const success = await deleteUser(req.params.id);
    res.json({ deleted: success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
