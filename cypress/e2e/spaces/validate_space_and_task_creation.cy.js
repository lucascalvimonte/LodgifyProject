describe('Create and Manage Spaces via ClickUp API', () => {
    let spaceName
    let spaceId

    // Before all tests, create a workspace via the API
    before(() => {
        // Generate a unique space name using the timestamp and create the space
        cy.generateSpaceName().then((generatedSpaceName) => {
            spaceName = generatedSpaceName
            cy.createSpace(spaceName).then((newSpace) => {
                spaceId = newSpace.id
            })
        })
    })

    beforeEach(() => {
        // Generate a unique space name using the timestamp and create the space
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.loginUser()
    })

    // After all tests, clean up by deleting the created space
    after(() => {
        if (spaceId) {
            cy.deleteSpace(spaceId)
        }
    })

    it('should verify the new space in the UI', () => {
        cy.contains(spaceName, { timeout: 30000 }).should('exist')
    })

    it('should create a new task in the test space', () => {
        const folderName = `folder-${spaceName}`
        const taskName = `task-${spaceName}`
        cy.createNewFolderInTheTestSpace(spaceName, folderName)
        cy.createNewTaskInTheFolder(taskName)
        cy.verifyTaskWasCreatedSuccessfully(spaceId, folderName, taskName)
    })


    it('should create task via API', () => {
    })
})