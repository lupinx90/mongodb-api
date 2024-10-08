const excelGenerator = (products, filename, res) => {
    const xl = require('excel4node');

    products = products.map(( product ) => {
        let id = product._id.toString();
        delete product._id;
        return{
            id,
            ...product,
        }
    })

    let wb = new xl.Workbook();
    let ws = wb.addWorksheet(('inventario'));

    for (let i = 1; i < products.length + 1; i++) {
        for (let j = 1; j < Object.values(products[0]).length + 1; j++) {
            let data = Object.values(products[ i - 1 ])[j - 1];
            if (typeof data === 'string'){
                ws.cell(i,j).string(data);
            }else{
                ws.cell(i,j).number(data);
            }
        }        
    }

    wb.write(`${filename}.xlsx`, res);
}

module.exports.ProductUtils = {
    excelGenerator,
}