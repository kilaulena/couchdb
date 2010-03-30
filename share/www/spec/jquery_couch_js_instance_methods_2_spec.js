// Specs for jquery_couch.js lines 210-299

describe 'jQuery couchdb db'
  before
    stubAlert();
  end
  
  after
    destubAlert();
  end
  
  before_each
    db = $.couch.db('spec_db');
  end

  describe 'info'
    
  end
  
  describe 'allDocs'
    
  end
  
  describe 'allDesignDocs'
    
  end
  
  describe 'allApps'
    
  end
  
  describe 'openDoc'
    
  end
  
  describe 'saveDoc'
    
  end
  
  describe 'bulkSave'
    
  end
end