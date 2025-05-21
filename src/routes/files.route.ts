import express from "express";
// controllers
import * as zipController   from "../controllers/zip.controller";
import * as excelController from "../controllers/excel.controller";
import * as zipExcelController from "../controllers/zip-excel.controller";
// middleware MW
import multiparty from 'connect-multiparty';
import { Uploads } from "../services/security";
import { auth } from "../services/security";
const router = express.Router();
const mult   = multiparty();

console.log('Registring roles routing /api/files');

console.log('[POST] MW /upload/zip ');
router.post(
    '/upload/zip',
    auth.require_auth_session,
    mult,
    Uploads.validateFile,
    Uploads.validateZip,
    zipController.upload
);

console.log('[POST] MW /upload/excel ');
router.post(
    '/upload/excel',
    auth.require_auth_session,
    mult,
    Uploads.validateFile,
    Uploads.validateExcel,
    excelController.upload,
);

console.log('[POST] MW /upload/zip-excel ');
router.post(
    '/upload/zip-excel',
    auth.require_auth_session,
    mult,
    Uploads.validateFile,
    Uploads.validateZip,
    zipExcelController.upload,
);

console.log('[GET] MW /get ');
router.get(
    '/get',
    excelController.getAll,
);

export { router as filesRoutes };
