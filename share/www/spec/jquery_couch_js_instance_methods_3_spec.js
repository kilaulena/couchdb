// Specs for jquery_couch.js lines 300-411

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

  describe 'removeDoc'
    
  end
  
  describe 'bulkRemove'

  end
  
  describe 'copyDoc'
    
  end
  
  describe 'query'
    
  end
  
  describe 'view'
    
  end
  
  describe 'getDbProperty'
    
  end
  
  describe 'setDbProperty'
    
  end
end