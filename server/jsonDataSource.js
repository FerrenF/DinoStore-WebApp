
//
//
//  DataSource(s)
//  As of yet, this is unused.
//
const fs = require('fs')

class DataSource{

    // A qualifier is defined best like this:
    //  root{
    //      property: value
    //      property: {
    //          sub-property: value
    //          }
    //  }
    //
    //  e.g.
    //
    //  root.property -> value
    //  root.property.sub-property -> value
    //
    //
    //
    //
    //

    constructor(props) {
        this.contents = null
        this.filePath = ""
        this.sourceType = null
    }


    // Read will return false if the qualifier does not exist
    read(qualifier){return false;}
    // Create will not overwrite a value that already exists
    create(qualifier, initialValue){ return false;}
    // Update will overwrite a value that already exists
    update(qualifier, newValue){ return false; }
    load(){ return false; }
    // Delete will return the value it deleted, or false if it was not found.
    delete(qualifier){return false; }
}

class JsonDataSource extends DataSource{

    constructor(filepath=null) {
        super();
        this.filePath = filepath
        this.sourceType = 'JSON'
        this.contents = {}
        if(filepath){
            this.load()
        }
    }

    load(path=this.filePath) {
        this.contents = JSON.parse(fs.readFileSync(path, 'utf-8'));
        return this.contents;
    }

    save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.contents, null, 2));
    }

    parseQualifier(qualifier) {
        return qualifier.split('.');
    }

    getValue(qualifier) {
        const keys = this.parseQualifier(qualifier);
        let value = this.contents;

        for (const key of keys) {
            if (value && value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return null;
            }
        }
        return value;
    }

    setValue(qualifier, newValue, createIfNotExists = false) {
        const keys = this.parseQualifier(qualifier);
        let value = this.contents;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!value.hasOwnProperty(key)) {
                if (createIfNotExists) {
                    value[key] = {};
                } else {
                    return false;
                }
            }
            value = value[key];
        }

        const lastKey = keys[keys.length - 1];
        if (createIfNotExists && !value.hasOwnProperty(lastKey)) {
            value[lastKey] = newValue;
            this.save();
            return true;
        } else if (!createIfNotExists && value.hasOwnProperty(lastKey)) {
            value[lastKey] = newValue;
            this.save();
            return true;
        }

        return false;
    }

    create(qualifier, initialValue) {
        if (this.getValue(qualifier) !== null) {
            return false;
        }
        return this.setValue(qualifier, initialValue, true);
    }

    read(qualifier) {
        const value = this.getValue(qualifier);
        return value !== null ? value : false;
    }

    update(qualifier, newValue) {
        if (this.getValue(qualifier) !== null) {
            return this.setValue(qualifier, newValue, false);
        }
        return false;
    }

    delete(qualifier) {
        const keys = this.parseQualifier(qualifier);
        let value = this.contents;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return false;
            }
        }

        const lastKey = keys[keys.length - 1];
        if (value.hasOwnProperty(lastKey)) {
            const deletedValue = value[lastKey];
            delete value[lastKey];
            this.save();
            return deletedValue;
        }
        return false;
    }
}

module.exports = {JsonDataSource}