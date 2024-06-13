const fs = require('fs');
const { JsonDataSource } = require('../server/jsonDataSource');
const fsExtra = require('fs-extra');

const testFilePath = './test.json';

const initialData = {
    root: {
        property: "value",
        nested: {
            subproperty: "subvalue"
        }
    }
};

const writeTestData = (data) => {
    fs.writeFileSync(testFilePath, JSON.stringify(data, null, 2));
};

describe('JsonDataSource', () => {
    let dataSource;

    beforeEach(() => {
        writeTestData(initialData);
        dataSource = new JsonDataSource(testFilePath);
        dataSource.load();
    });

    afterEach(() => {
        fsExtra.removeSync(testFilePath);
    });

    test('should load the JSON file', () => {
        const data = dataSource.contents;
        expect(data).toEqual(initialData);
    });

    test('should read existing data', () => {
        const value = dataSource.read('root.property');
        expect(value).toBe('value');
    });

    test('should return false when reading non-existing data', () => {
        const value = dataSource.read('root.nonexistent');
        expect(value).toBe(false);
    });

    test('should create new data', () => {
        const success = dataSource.create('root.newProperty', 'newValue');
        expect(success).toBe(true);
        const value = dataSource.read('root.newProperty');
        expect(value).toBe('newValue');
    });

    test('should not overwrite existing data on create', () => {
        const success = dataSource.create('root.property', 'newValue');
        expect(success).toBe(false);
        const value = dataSource.read('root.property');
        expect(value).toBe('value');
    });

    test('should update existing data', () => {
        const success = dataSource.update('root.property', 'updatedValue');
        expect(success).toBe(true);
        const value = dataSource.read('root.property');
        expect(value).toBe('updatedValue');
    });

    test('should return false when updating non-existing data', () => {
        const success = dataSource.update('root.nonexistent', 'newValue');
        expect(success).toBe(false);
    });

    test('should delete existing data', () => {
        const deletedValue = dataSource.delete('root.property');
        expect(deletedValue).toBe('value');
        const value = dataSource.read('root.property');
        expect(value).toBe(false);
    });

    test('should return false when deleting non-existing data', () => {
        const deletedValue = dataSource.delete('root.nonexistent');
        expect(deletedValue).toBe(false);
    });
});
