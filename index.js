const fs = require('fs');
const { exec} = require('child_process');
const { PDFDocument } = require('pdf-lib');
const getFiles = require("./getFiles");
const folderPath = './documentation/developer_manual';

const fetchDocumentation = async () => {
    try {
        await exec(
            "git clone https://github.com/nextcloud/documentation.git manual"
        );
        setTimeout(() => {
             exec("mv manual/developer_manual documentation");
             exec("rm -rf manual");
        }, 50000);

        console.log('Репозиторий клонирован')
    } catch (error) {
        console.error("Ошибка при клонирование репозитория:", error);
    }
};

const gitUpdate = async () => {
    try {
        await exec("git add .");
        await exec("git commit -m 'updated'");
        await exec("git push -u origin main");
    } catch (error) {
        console.error("Ошибка при отправке обновления (git)", error);
    }
};

const createFolder = () => {
    fs.mkdir('./PDF', { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Папка успешно создана');
    });

};
const mergePdf = async (fileList) => {

    let pdfName = 1
    for (const file of fileList) {
        const command = `rst2pdf ${file} -o ./PDF/${pdfName}.pdf`;
        const child = exec(command);
        pdfName++
    }
};
const mergePdfFiles = async (inputFiles, outputFilePath) => {
    const mergedPdf = await PDFDocument.create();

    for (const file of inputFiles) {
        const pdfBytes = await fs.promises.readFile(file);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    await fs.promises.writeFile(outputFilePath, mergedPdfBytes);

    console.log('PDF files successfully merged');
};
const deleteFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = `${folderPath}/${file}`;

            if (fs.lstatSync(curPath).isDirectory()) {
                // Рекурсивно удаляем подпапки
                deleteFolder(curPath);
            } else {
                // Удаляем файлы внутри папки
                fs.unlinkSync(curPath);
            }
        });

        // Удаляем саму папку
        fs.rmdirSync(folderPath);
        console.log(`Папка ${folderPath} успешно удалена`);
    } else {
        console.error(`Папка ${folderPath} не найдена`);
    }


};


createFolder();


setTimeout(() => {
    fetchDocumentation();
}, 1000);



setTimeout(() => {

}, 60000);



setTimeout(() => {
    var rstFiles = getFiles(folderPath, [], '.rst');
    mergePdf(rstFiles).then(() => {
        console.log('PDF файлы успешно созданы');
    }).catch((error) => {
        console.log('Произошла ошибка при создании PDF файлов:', error);
    });
}, 65000);

setTimeout(() => {
    const pdfFiles = getFiles('./PDF', [], '.pdf')
    mergePdfFiles(pdfFiles, `./documentation/${new Date()}.pdf`);
}, 80000);


setTimeout(() => {
    deleteFolder('./PDF');
    deleteFolder('./documentation/developer_manual');
}, 85000);

setTimeout(() =>{
    gitUpdate();
}, 90000)

