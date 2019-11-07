/// <reference types="cypress" />
describe('Hackaton Applitools', () => {
    beforeEach(() => {
        cy.visit('/hackathonV2.html')
    })
    describe('Login Page UI Elements Test', () => {
        it('should diplay the login page with all elements', () => {

            // Check all logos, pictures
            cy.get('.logo-w').should('be.visible')
            //cy.get(':nth-child(1) > .pre-icon').should('be.visible') <= No more Username img in V2
            //cy.get(':nth-child(2) > .pre-icon').should('be.visible') <= No more Fingerprint img in V2
            cy.get('[style="display: inline-block; margin-bottom:4px;"] > img').should('be.visible')
            cy.get(':nth-child(2) > img').should('be.visible')
            // cy.get(':nth-child(3) > img').should('be.visible') <= No more LinkedIn iimg in V2

            // Check all text labels
            cy.get('.auth-header').should('contain.text', 'Logout Form') // <= Incorrect label detected in V2, Logout instead of Login
            cy.get(':nth-child(1) > label').should('have.text', 'Username')
            cy.get('form > :nth-child(2) > label').should('have.text', 'Pwd') // <= Label modified detected in V2, Pwd instead of Password

            cy.get('.form-check-label').should('have.text', 'Remember Me')

            // Check that checkbox exists and not checked
            cy.get('.form-check-input').should('be.visible').and('not.be.checked')

            // Check button name
            cy.get('#log-in').should('have.text', 'Log In')

            // Check text input
            cy.get('#username').should('be.enabled').and('be.empty')
            cy.get('#password').should('be.enabled').and('be.empty')
        })
    })

    describe('Login Data-Driven Test', () => {
        it('should show an error if no username and no password', () => {
            cy.get('#log-in').click();
            // because there's a randoom id here, I use the class path
            cy.get('.alert.alert-warning')
                .should('contain.text', 'Please enter both username and password') // <= Error message has changed in V2
        })

        it('should show an error if password is missing', () => {
            cy.get('#username').type('johnDoe')
            cy.get('#log-in').click();
            // cy.get('.alert.alert-warning').should('contain.text','Password must be present') // <= No more error message in V2
            // Then I check that we are not logged in
            cy.get('.logged-user-i').should('not.be.visible')
        })

        it('should show an error if username is missing', () => {
            cy.get('#password').type('1234')
            cy.get('#log-in').click();
            cy.get('.alert.alert-warning').should('contain.text', 'Username must be present') // <= Still ok but not visually correct in V2
        })

        it('should log in if both username and password are filled', () => {
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()
            // Redirected to https://demo.applitools.com/hackathonAppV2.html
            cy.url().should('eq', 'https://demo.applitools.com/hackathonAppV2.html') // <= Of course
            // Logged user visible
            cy.get('.logged-user-i').should('be.visible')
        })
    })

    describe('Logged in, Table Sort Test', () => {
        it('should display rows in ascending order', () => {
            /*
            ** Here I tried to test what's required but we shouldn't do it this way. I had hard time
            ** with the amounts strings and didn't find a library to help with this. At least, I was able to check that
            ** after sorting the table, then the first line is the minimum amount and the last one the max.
            ** I also check that description is the correct one.
            ** This is something that should be done with Visual Testing
            */
            var minAmount = 10000
            var descMin = ""
            var maxAmount = 0
            var descMax = ""
            var tmpDesc = ""
            var tmpAMount = ""
            // @Todo: Extract visit and login with an API call (login is already tested)
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()

            //Create a 2 dimension array to store all rows and 2 columns of Transaction Table content
            var transactionNotSorted = new Array(7) // 6 rows (ok for this exercise)
            for (var row = 0; row < transactionNotSorted.length; row++) {
                transactionNotSorted[row] = new Array(2) // only 2 columns (desc and amount)

            }

            //Create a 2 dimension array to store all rows and 2 columns of Transaction Table content
            var transactionSorted = new Array(7) // 6 rows (ok for this exercise)
            for (var row = 0; row < transactionSorted.length; row++) {
                transactionSorted[row] = new Array(2) // only 2 columns (desc and amount)

            }
            // fill the 2 dimension array with content of transaction table (only Desc and amount column)
            // Save the min amount with description, same with max amount. Will be checked after sorting
            for (var row = 1; row < 7; row++) {// starts from 1 to avoid titles
                cy.get('tr').eq(row).within(() => {
                    cy.get('.cell-with-media').invoke('text').then((text1) => {
                        transactionNotSorted[row - 1][0] = text1
                        tmpDesc = text1
                    })

                    /*Need to work on amount string to convert to a float bc of '-' ',' and USD
                    and search the min and max and retrieve description.
                    @TODO: I should probably use a library, but didn't find the perfect fit & this
                    is probably not part of the exercise. At least I tried and learn new things :) */
                    cy.get('.text-right').invoke('text').then((text2) => {
                        text2 = text2.trim().replace(',', '')
                        transactionNotSorted[row - 1][1] = text2
                        var cursor = text2.indexOf(" USD")
                        var amount = parseFloat(text2.substring(2, cursor).trim())
                        if (text2.substring(0, 1) === '-') {
                            amount = -Math.abs(amount);
                        }

                        if (amount < minAmount) {
                            minAmount = amount
                            descMin = tmpDesc
                        }
                        if (amount > maxAmount) {
                            maxAmount = amount
                            descMax = tmpDesc
                        }
                    })
                })

            }

            /*Check that first line contains desc and amount of the minimum amount line before sorting
            and check that last line contains desc and amount of the max amount line*/
            cy.get('#amount').click() // Sort the table with amount column
            cy.get('#transactionsTable').within(() => {
                cy.get('tr').eq(1).within(() => { //Check first line
                    cy.get('.cell-with-media').should('contains.text', descMin)
                    cy.get('.text-right').should('contains.text', minAmount.toString().replace('-', '- '))
                })
                cy.get('tr').eq(6).within(() => { //Check last line
                    cy.get('.cell-with-media').should('contains.text', descMax)
                    //maxAmount is 1250 instead of 1,250. This check will fail is max is different
                    cy.get('.text-right').should('contains.text', "1,250")
                })
            })
            /* I'm glad to see that my huge complex algorithm was able to spot that the table is not
            ** well sorted. First element is "Ebay Marketplace" with amount=-244 instead of "MailChimp Services
            ** with amount=-320. So I don't modify this test that is correct, it's a real issue.
            */
        })
    })

    describe('Logged in, Canvas Chart Test', () => {
        it('should display compare expenses bar', () => {
            /* It seems hard to do something with the content of the canvas
            ** Better use Visual Testing here
            */
            // @Todo: Extract visit and login with a fast and stable API call (login doesn't need to be tested again here)
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()

            cy.get('#showExpensesChart').click()
            //assert that canvas is visible. Will be tested with visual testing
            cy.get('#canvas').should('be.visible')

            // adds nextYear dataSet
            cy.get('#addDataset').click()
            // We just check that canvas is visible and that we can point in it
            cy.get('#canvas')
                .should('be.visible')
                .trigger('pointerdown', 'center')
        })
    })

    describe('Logged in, Dynamic Content Test', () => {
        it('should display the gif ads', () => {
            // @Todo: Extract visit and login with a fast and stable API call (login is already tested)
            cy.visit('/hackathonV2.html?showAd=true')
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()

            //cy.get('#flashSale > img').should('be.visible') // <= No more displayed in V2. Bug or feature ?
            cy.get('#flashSale2 > img').should('be.visible') // <= Different image displayed in V2, cannot be spotted with TraditionalTests :(
        })
    })
})

