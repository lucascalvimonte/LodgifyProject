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
            cy.createSpaceViaAPI(spaceName).then((newSpace) => {
                spaceId = newSpace.id
            })
        })
    })

    beforeEach(() => {
        cy.clearLocalStorage()
        cy.clearCookies()
    })

    // After all tests, clean up by deleting the created space
    after(() => {
        if (spaceId) {
            cy.deleteSpace(spaceId)
        }
    })

    it('should verify the new space in the UI', () => {
        cy.loginUser()
        cy.contains(spaceName, { timeout: 30000 }).should('exist')
    })

    it('should create a new task in the test space', () => {
        folderName = `folder-${spaceName}`
        taskName = `task-${spaceName}`
        cy.loginUser()
        cy.createNewFolderInTheTestSpace(spaceName, folderName)
        cy.createNewTaskInTheFolder(taskName)
        cy.verifyTaskWasCreatedSuccessfully(spaceId, folderName, taskName)
    })


    it('should create task via API', () => {
        const newTask = `new-task-${spaceName}`
        cy.validateTaskCreatedViaAPI(spaceName, spaceId, folderName, newTask)
        cy.loginUser()
        cy.validateTaskWasCreatedViaUI(spaceName, folderName, newTask)
    })
})