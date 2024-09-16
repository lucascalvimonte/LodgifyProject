describe('Create and Manage Spaces via ClickUp API', () => {
    let spaceName
    let spaceId
    let taskName
    let folderName

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

    it.skip('should verify the new space in the UI', () => {
        cy.contains(spaceName, { timeout: 30000 }).should('exist')
    })

    it('should create a new task in the test space', () => {
        folderName = `folder-${spaceName}`
        taskName = `task-${spaceName}`
        cy.createNewFolderInTheTestSpace(spaceName, folderName)
        cy.createNewTaskInTheFolder(taskName)
        cy.verifyTaskWasCreatedSuccessfully(spaceId, folderName, taskName)
    })


    it('should create task via API', () => {
        const newTask = `new-task-${spaceName}`
        cy.validateTaskCreatedViaUI(spaceName, spaceId, folderName, newTask)
        cy.validatTaskWasCreatedViaUI(spaceName, folderName, newTask)
    })
})