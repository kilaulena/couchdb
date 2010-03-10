describe 'CouchDB'
  describe 'instance'
    before_each
      db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
      db.deleteDb();
      db.createDb();
    end
    
    describe '.request'
      it 'should return a XMLHttpRequest'
        var req = CouchDB.request("GET", "/spec_db");
        req.should.include 'readyState'
        req.should.include 'responseText'
        req.should.include 'statusText'
        // in Safari a XMLHttpRequest is actually a XMLHttpRequestConstructor, 
        // otherwise we could just do:
        // req.should.be_a XMLHttpRequest
      end
    end  
  end
  
  describe 'class'
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
      
      it 'should throw an error with the responseText of the request'
        var req = CouchDB.request("GET", "/nonexisting_db");
        -{CouchDB.maybeThrowError(req)}.should.throw_error (undefined, { error: "not_found", reason: "no_db_file" })
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
    
end