describe 'CouchDB'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
    db.deleteDb();
    db.createDb();
  end
  
  describe '.request'
    it 'should return a XMLHttpRequest'
      var req = CouchDB.request("GET", "/spec_db/_changes");
      req.should.be_a XMLHttpRequest
    end
  end
end