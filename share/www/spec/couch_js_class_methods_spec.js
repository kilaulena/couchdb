// Specs for couch.js lines 320-477

describe 'CouchDB class'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
    db.deleteDb();
    db.createDb();
  end
  
  after
    db.deleteDb();
  end
  
  describe '.maybeThrowError'
    it 'should throw an error when the request has status 404'
      var req = CouchDB.request("GET", "/nonexisting_db");
      -{CouchDB.maybeThrowError(req)}.should.throw_error 
    end
    
    it 'should throw an error when the request has status 412'
      var req = CouchDB.request("PUT", "/spec_db");
      -{CouchDB.maybeThrowError(req)}.should.throw_error
    end
    
    it 'should throw an error when the request has status 405'
      var req = CouchDB.request("DELETE", "/_utils");
      -{CouchDB.maybeThrowError(req)}.should.throw_error
    end
    
    it 'should throw the responseText of the request'
      var req = CouchDB.request("GET", "/nonexisting_db");
      try {
        CouchDB.maybeThrowError(req)
      } catch(e) {
        e.error.should.eql JSON.parse(req.responseText).error
        e.reason.should.eql JSON.parse(req.responseText).reason
      }
    end
    
    it 'should throw an unknown error when the responseText is invalid json'
      mock_request().and_return('invalid json...', 'application/json', 404, {})
      try {
        CouchDB.maybeThrowError(CouchDB.newXhr())
      } catch(e) {
        e.error.should.eql "unknown"
        e.reason.should.eql "invalid json..."
      }
    end
  end

  describe '.params'
    it 'should turn a json object into a http params string'
      var params = CouchDB.params({'president':'laura', 'cag':'lee'})
      params.should.eql "president=laura&cag=lee"
    end
    
    it 'should return a blank string when the object is empty'
      var params = CouchDB.params({})
      params.should.eql ""
    end
  end  
end