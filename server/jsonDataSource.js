
class DataSource{
    constructor(props) {
        this.contents = null
        this.filePath = ""
    }

    write_to(write_target, write_object){ return false; }
    load(){ return false; }
    remove(remove_target){return false; }
}
class JsonDataSource extends DataSource{

    constructor(filepath) {
        super();
        this.filePath = filepath
    }

    load(){
        this.contents = JSON.parse(fs.readFileSync(dataSource));
        return this.contents;
    }

    remove(remove_target) {
        return super.remove(remove_target);
    }

    write_to(write_target, write_object) {
        return super.write_to(write_target, write_object);
    }
}
