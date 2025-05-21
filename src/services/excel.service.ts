import XLSX    from 'xlsx';
import * as fs from 'fs';

class ExcelService {

    constructor() {}

    readFileBytes(bytestr): Promise<any> {
        return new Promise((resolve) => {
            const workbook       = XLSX.read(bytestr, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet      = workbook.Sheets[firstSheetName];
            const header         = this.getHeaderRow(worksheet);
            const results        = XLSX.utils.sheet_to_json(worksheet);
            const meta           = { sheetName: firstSheetName };
            resolve({header, results, meta});
        });
        
    }

    readFile(rawFile): Promise<any> {
        return new Promise((resolve) => {
            const data           = fs.readFileSync(rawFile.path);
            const workbook       = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet      = workbook.Sheets[firstSheetName];
            const header         = this.getHeaderRow(worksheet);
            const results        = XLSX.utils.sheet_to_json(worksheet);
            const meta           = { sheetName: firstSheetName };
            resolve({header, results, meta});
        });
        
    }

    private getHeaderRow (sheet: any): any[] {
        const headers: any[] = [];
        const range   = XLSX.utils.decode_range(sheet['!ref']);
        let C;
        const R = range.s.r;
    
        // start in the first row
        for(C=range.s.c; C<=range.e.c; ++C) { // walk every column in the range
            const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
            // find the cell in the first row
            let hdr = 'UNKNOW' + C //replace with your desired default
    
            if( cell && cell.t ) hdr = XLSX.utils.format_cell(cell);
    
            headers.push(hdr);
        }
    
        return headers;
    }

}

export default new ExcelService;
