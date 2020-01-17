/// <reference types="Cypress" />
function getTodaysDate () {
//
// Use the wrapped version of mement.js for Date/Time handling e.g. 13 Jan 16:55
//
  const todaysDate = Cypress.moment().format('DD MMM HH:mm')
  const todaysMonth = Cypress.moment().format('MMM')
  cy.log('Time now is ' + todaysDate)
}

function getDataTable(dataFeed,aliasName)
{
  //
  // Build an alias to the current (generic) data-source
  //
  var fullDataSource = '[data-source="/wp-admin/admin-ajax.php?action=marketdata&data_feed=' + dataFeed + '"]'
  cy.get(fullDataSource).as('Prices')            
  cy.log('data-source is ' + fullDataSource + 'with alias name ' + aliasName)
  cy.get('@Prices').click().as(aliasName)
  //cy.contains(fullDataSource).invoke()
}

context('Navigation', () => {
  beforeEach(() => 
  {
    cy.viewport(1400, 1000)
    //cy.visit('https://cefetra.co.uk')
    //cy.get('.navbar-nav').contains('Commands').click()
    //cy.get('.dropdown-menu').contains('Navigation').click()
  })

  /*
  it('cy.reload() - reload the page', () => {
    // https://on.cypress.io/reload
    cy.reload()

    // reload the page without using the cache
    cy.reload(true)
  })
  */

  describe('Launch Home Page', function() {
    it('Visits the Home Page', function() {
      //cy.viewport(1600, 1200)
      cy.visit('https://cefetra.co.uk')
      getTodaysDate()
    })
  })  

  describe('Market Data', function() {
    it('Click on Market Data link', function() {
      //cy.visit('https://cefetra.co.uk/market-data/')
      cy.contains('Market data').as('Market-Data-Link')
      //cy.get('@Market-Data-Link').
      cy.get('@Market-Data-Link').click()
    })
  })   

  describe('Register Button', function() {
    it('Check for Register Button', function() {
      cy.get('.button').contains('Register').as('Register')
    })
  })  

  describe('GBP v Euro', function() {
    it('Check for GBP v Euro', function() {
      //cy.visit('https://cefetra.co.uk/market-data/')
      cy.contains('GBP_vs_EUR').as('GBP_vs_EUR') 
      //cy.get(':nth-child(4) > .feed-table__grid > .feed-table__col--last > .feed-table').as('GBP_v_Euro')
      cy.get('@GBP_vs_EUR').click()      
      //cy.get(':nth-child(4) > .feed-table__grid > .feed-table__col--last > .feed-table > .feed-table__footer').as('GBP_v_Euro')
    })
  })  

  describe('GBP v USD', function() {
    it('Check for GBP v USD', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')
      cy.contains('GBP_vs_USD').as('GBP_vs_USD')
      cy.get('@GBP_vs_USD').click()
    })
  })  

  describe('Euro v USD', function() {
    it('Check for Euro v USD', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')
      cy.contains('EUR_vs_USD').as('EUR_vs_USD')
      cy.get('@EUR_vs_USD').click()    
    })
  })  

})

context('London Grains', () => {
  beforeEach(() => 
  {
    //cy.viewport(1400, 1000)
    //cy.visit('https://cefetra.co.uk')
    //cy.get('.navbar-nav').contains('Commands').click()
    //cy.get('.dropdown-menu').contains('Navigation').click()
  })

  describe('London Wheat', function() {
    it('London Wheat', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')
      cy.contains('LONDON FEED WHEAT').click()
    })
  })   
})

context('Paris Grains', () => {
  describe('Paris Wheat', function() {
    it('Paris Wheat', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')
      cy.contains('PARIS MILLING WHEAT').click()
    })
  })
  //
  // Check Structure
  // 
  describe('Paris Wheat Structure', function() {
    it('Paris Wheat Structure', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')

      //cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .ult-content-box-container').as('Paris-Wheat')    
      cy.get('[data-source="/wp-admin/admin-ajax.php?action=marketdata&data_feed=PARIS_MILLING_WHEAT"]').as('Prices')            
      //cy.log('@Paris-Wheat')
      cy.get('@Prices').click().as('Paris-Wheat')
      //cy.get('@Paris-Wheat').find('tr').as('Paris-Wheat-Rows')

      
      //
      // thead
      //      
      cy.get('@Paris-Wheat').find('thead').as('Table-Header')
      cy.get('@Table-Header').click()
      cy.get('@Table-Header').should('have.length', 1);
 
      cy.get('@Table-Header').should(($thead) => {
        const text = $thead.text()
      
        expect(text).to.include('MONTH')
        expect(text).to.include('PRICE')
        expect(text).to.include('CHANGE')
      })
            
      cy.get('@Paris-Wheat').find('tbody').as('Table-Body')
      cy.get('@Table-Body').find('tr').as('Paris-Wheat-Rows')
      cy.get('@Paris-Wheat-Rows').should('have.length', 10);
      cy.get('@Paris-Wheat-Rows').first().click()
         
      //cy.get('@Paris-Wheat-Rows').click({ multiple: true })    
      
      cy.get('@Paris-Wheat').find('tfooter').as('Table-Footer')
      cy.get('@Table-Footer').click()
      
      cy.get('@Table-Footer').should('have.length', 1)

      cy.get('@Table-Footer').invoke('text').then((textValue) => {
        const footerText = textValue
        cy.log('Footer is ' + footerText)
        const todaysMonth = Cypress.moment().format('MMM')
        const todaysHour =  Cypress.moment().format('HH')
        const todaysMinute =  Cypress.moment().format('mm')        
        const todaysDateTime =  Cypress.moment().format('DD MMM HH:ss') // e.g. 15 Jan 15:55
        expect(textValue).to.include(todaysMonth)
        cy.log('Check Date Feed ' + footerText + ' is close ' + todaysDateTime)
        const timeDiff = Cypress.moment.duration("00:01:00");
        const todaysCloseTime = Cypress.moment(todaysDateTime).subtract(timeDiff)
        cy.log('Close Time is ' +  Cypress.moment(todaysCloseTime).format('DD MMM HH:ss'))        
      })

      //
      // Scroll to main prices table
      //
      //cy.get('@Prices').scrollIntoView()      
    
      cy.get('@Paris-Wheat-Rows').each(($value, index, $obj) => {
        cy.log('Value is ' + $value.text())
        //return $value.text()
      })
    })
  }) 

  describe('Paris Wheat Caption', function() {
    it('Paris Wheat Caption', function() {
      //
      // Call getDataTable first
      //
      getDataTable("PARIS_MILLING_WHEAT", "Paris-Wheat")
      //
      // Caption
      //
      cy.get('@Paris-Wheat').find('caption').as('Table-Caption')
      cy.get('@Table-Caption').click()
      cy.get('@Table-Caption').should('have.length', 1);

      cy.get('@Table-Caption').invoke('text').then((textValue) => {
        const captionText = textValue    
        expect(captionText).to.eq('PARIS MILLING WHEAT')
        cy.log('Caption is ' + captionText)  
      })
    })
  })
      
  //
  //
  //  
  describe('Paris Rapeseed', function() {
    it('Paris Rapeseed', function() {
      //cy.visit('https://cefetra.co.uk//current-market-data/')
      cy.contains('PARIS RAPESEED')
    })
  })   
})
//
// cy.get(':nth-child(4) > .feed-table__grid > .feed-table__col--last > .feed-table > .feed-table__footer')
//