// Specs for couch.js lines 326-483

describe 'CouchDB instance'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
  end
  
  describe '.info'
    it 'should get information about the database'
      db.createDb();
      var result = db.info("GET", "/spec_db");
      result.db_name.should.eql "spec_db"
      result.doc_count.should.eql 0
      result.instance_start_time.should.have_length 16
      db.deleteDb();
    end
  end
end