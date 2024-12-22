const router = require("express").Router();
var { verifyToken } = require("../middleware/VerifyToken");
var { checkUserRole } = require("../middleware/CekRoles");
const { PEMBIMBING, SISWA } = require("../utils/constants");

// var updateNilaiBulananController = require("../controllers/nilaiBulanan/UpdateNilaiBulananController")
// var createNilaiBulananController = require("../controllers/nilaiBulanan/CreateNilaiBulananController")
var getAllNilaiAkhirPembimbingController = require("../controllers/nilaiAkhir/GetAllNilaiAkhirPembimbingController");
var getAllNilaiAkhirSiswaController = require("../controllers/nilaiAkhir/GetAllNilaiAkhirSiswaController");

// router.post("/create", verifyToken, checkUserRole(PEMBIMBING), createNilaiBulananController)
// router.put("/update", verifyToken, checkUserRole(PEMBIMBING), updateNilaiBulananController)
router.get(
  "",
  verifyToken,
  checkUserRole(PEMBIMBING),
  getAllNilaiAkhirPembimbingController
);
router.get(
  "/siswa",
  verifyToken,
  checkUserRole(SISWA),
  getAllNilaiAkhirSiswaController
);

module.exports = router;
