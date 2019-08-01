import { OpenAPIV3 } from 'openapi-types';
import SwaggerParser from 'swagger-parser';
import specFormatter from './formatters/specFormatter';
import { CodegenOptions } from './models/codegenOptions.model';
import Handlebars from 'handlebars';
import { FormattedSpec } from './models/formattedSpec.model';
import fse from 'fs-extra';
import folderWalker from 'klaw';
import path from 'path';

async function generate(options: CodegenOptions) {
  const spec = (await SwaggerParser.parse(
    options.inputSpec
  )) as OpenAPIV3.Document;

  const formattedSpec = specFormatter.formatSpec(spec);
  if (options.debug) {
    // tslint:disable-next-line: no-console
    return console.log(JSON.stringify(formattedSpec, null, 4));
  }

  if (options.handlebarsExtensions) {
    // register handlebars extensions
    const handlebarsExtensions = require(options.handlebarsExtensions);
    handlebarsExtensions(Handlebars);
  }

  await generateDirectoryStructure(
    formattedSpec,
    options.templatesFolder,
    options.outputFolder
  );
}

async function generateDirectoryStructure(
  spec: FormattedSpec,
  templatesFolder: string,
  outputFolder: string
) {
  await fse.mkdirp(outputFolder);

  return new Promise((resolve, reject) => {
    let allPromises = [];
    const walker = folderWalker(templatesFolder);
    walker.on('data', async file => {
      try {
        if (file.stats.isDirectory()) {
          // we're only interested in processing files
          return;
        }
        const name = path.basename(file.path);
        if (name.includes('_OPERATION_')) {
          // create a file for each operation
          const promises = spec.operations.map(async operation => {
            const context = { ...spec, operation };
            const writeFilePath = file.path.replace(
              '_OPERATION_',
              operation.id
            );
            return generateFile(
              templatesFolder,
              outputFolder,
              context,
              file.path,
              writeFilePath
            );
          });
          allPromises = [...allPromises, ...promises];
        } else if (name.includes('_MODEL_')) {
          // create a file for each model
          const promises = spec.models.map(async model => {
            const context = { ...spec, model };
            const writeFilePath = file.path.replace('_MODEL_', model.name);
            return generateFile(
              templatesFolder,
              outputFolder,
              context,
              file.path,
              writeFilePath
            );
          });
          allPromises = [...allPromises, ...promises];
        } else if (name.includes('_RESOURCE_')) {
          // create a file for each resourceWithOperations
          const promises = spec.resourcesWithOperations.map(async resource => {
            const context = { ...spec, resource };
            const writeFilePath = file.path.replace('_RESOURCE_', resource.id);
            return generateFile(
              templatesFolder,
              outputFolder,
              context,
              file.path,
              writeFilePath
            );
          });
          allPromises = [...allPromises, ...promises];
        } else {
          // this file should only exist once
          allPromises = [
            ...allPromises,
            generateFile(
              templatesFolder,
              outputFolder,
              spec,
              file.path,
              file.path
            ),
          ];
        }
      } catch (e) {
        return reject(e);
      }
    });

    walker.on('error', err => {
      return reject(err);
    });
    walker.on('end', async () => {
      try {
        await Promise.all(allPromises);
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  });
}

async function generateFile(
  templatesFolder: string,
  outputFolder: string,
  context: any,
  readFilePath: string,
  writeFilePath: string
) {
  // get generated path
  const templatePath = path.relative(
    templatesFolder,
    writeFilePath.replace('.hbs', '')
  );
  const generatedPath = path.resolve(outputFolder, templatePath);

  // get generated content
  const templateData = await fse.readFile(readFilePath, 'utf-8').catch(e => {
    throw Error(`Unable to read file ${readFilePath}\nMessage: ${e.message}`);
  });
  const template = Handlebars.compile(templateData, { noEscape: true });
  const generatedContent = template(context);

  await fse.outputFile(generatedPath, generatedContent).catch(e => {
    throw Error(`Unable to write file ${generatedPath}\nMessage: ${e.message}`);
  });
}

export default {
  generate,
};
