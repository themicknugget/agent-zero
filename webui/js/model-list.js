// Model list management for settings
document.addEventListener('alpine:init', function () {
    Alpine.data('modelListManager', function () {
        return {
            // Initialize with empty lists
            chat_models: [],
            util_models: [],
            embed_models: [],
            browser_models: [],

            // Track which model list is being edited
            currentModelType: null,

            // Track if the model list editor is open
            isModelListEditorOpen: false,

            // Initialize from settings
            init() {
                console.log('Initializing model list manager');

                // Initialize with empty lists
                this.chat_models = [
                    {
                        provider: "OPENAI",
                        name: "gpt-4o",
                        kwargs: { "temperature": "0" },
                        ctx_length: 120000,
                        vision: false,
                        rl_requests: 0,
                        rl_input: 0,
                        rl_output: 0
                    }
                ];

                this.util_models = [
                    {
                        provider: "OPENAI",
                        name: "gpt-4o-mini",
                        kwargs: { "temperature": "0" },
                        ctx_length: 120000,
                        vision: false,
                        rl_requests: 0,
                        rl_input: 0,
                        rl_output: 0
                    }
                ];

                this.embed_models = [
                    {
                        provider: "HUGGINGFACE",
                        name: "sentence-transformers/all-MiniLM-L6-v2",
                        kwargs: {},
                        ctx_length: 0,
                        vision: false,
                        rl_requests: 0,
                        rl_input: 0,
                        rl_output: 0
                    }
                ];

                this.browser_models = [
                    {
                        provider: "OPENAI",
                        name: "gpt-4o",
                        kwargs: { "temperature": "0" },
                        ctx_length: 0,
                        vision: false,
                        rl_requests: 0,
                        rl_input: 0,
                        rl_output: 0
                    }
                ];

                // Watch for settings updates
                document.addEventListener('settings-updated', (event) => {
                    console.log('Settings updated event received', event.detail);
                    this.updateModelLists(event.detail);
                });
            },

            // Update model lists from settings
            updateModelLists(settings) {
                console.log('Updating model lists from settings', settings);

                // Only update if settings has the model lists
                if (settings) {
                    // Keep existing lists if settings doesn't have them
                    if (settings.chat_models && settings.chat_models.length > 0) {
                        this.chat_models = settings.chat_models;
                    }

                    if (settings.util_models && settings.util_models.length > 0) {
                        this.util_models = settings.util_models;
                    }

                    if (settings.embed_models && settings.embed_models.length > 0) {
                        this.embed_models = settings.embed_models;
                    }

                    if (settings.browser_models && settings.browser_models.length > 0) {
                        this.browser_models = settings.browser_models;
                    }
                }

                console.log('Updated model lists', {
                    chat: this.chat_models,
                    util: this.util_models,
                    embed: this.embed_models,
                    browser: this.browser_models
                });
            },

            // Open the model list editor
            openModelListEditor(modelType) {
                console.log(`Opening model list editor for ${modelType}`);

                // Make sure we have a valid model type
                if (!modelType) {
                    console.error('No model type provided');
                    return;
                }

                // Convert model_type to just the type part (e.g., chat_models_button -> chat)
                if (modelType.includes('_models_button')) {
                    modelType = modelType.replace('_models_button', '');
                }

                this.currentModelType = modelType;
                this.isModelListEditorOpen = true;
                console.log(`isModelListEditorOpen set to ${this.isModelListEditorOpen}`);

                // Make sure we have at least one model in the list
                const list = this.getCurrentModelList();
                if (!list || list.length === 0) {
                    // Add a default model based on the type
                    switch (modelType) {
                        case 'chat':
                            this.chat_models = [
                                {
                                    provider: "OPENAI",
                                    name: "gpt-4o",
                                    kwargs: { "temperature": "0" },
                                    ctx_length: 120000,
                                    vision: false,
                                    rl_requests: 0,
                                    rl_input: 0,
                                    rl_output: 0
                                }
                            ];
                            break;
                        case 'util':
                            this.util_models = [
                                {
                                    provider: "OPENAI",
                                    name: "gpt-4o-mini",
                                    kwargs: { "temperature": "0" },
                                    ctx_length: 120000,
                                    vision: false,
                                    rl_requests: 0,
                                    rl_input: 0,
                                    rl_output: 0
                                }
                            ];
                            break;
                        case 'embed':
                            this.embed_models = [
                                {
                                    provider: "HUGGINGFACE",
                                    name: "sentence-transformers/all-MiniLM-L6-v2",
                                    kwargs: {},
                                    ctx_length: 0,
                                    vision: false,
                                    rl_requests: 0,
                                    rl_input: 0,
                                    rl_output: 0
                                }
                            ];
                            break;
                        case 'browser':
                            this.browser_models = [
                                {
                                    provider: "OPENAI",
                                    name: "gpt-4o",
                                    kwargs: { "temperature": "0" },
                                    ctx_length: 0,
                                    vision: false,
                                    rl_requests: 0,
                                    rl_input: 0,
                                    rl_output: 0
                                }
                            ];
                            break;
                    }
                }

                // Force a refresh of the UI
                setTimeout(() => {
                    console.log(`After timeout, isModelListEditorOpen is ${this.isModelListEditorOpen}`);
                }, 100);
            },

            // Close the model list editor
            closeModelListEditor() {
                this.isModelListEditorOpen = false;
                this.currentModelType = null;
            },

            // Get the current model list based on type
            getCurrentModelList() {
                switch (this.currentModelType) {
                    case 'chat':
                        return this.chat_models;
                    case 'util':
                        return this.util_models;
                    case 'embed':
                        return this.embed_models;
                    case 'browser':
                        return this.browser_models;
                    default:
                        return [];
                }
            },

            // Add a new model to the current list
            addModel() {
                const list = this.getCurrentModelList();
                list.push({
                    provider: "OPENAI",
                    name: "",
                    kwargs: { "temperature": "0" },
                    ctx_length: 0,
                    vision: false,
                    rl_requests: 0,
                    rl_input: 0,
                    rl_output: 0
                });
            },

            // Remove a model from the current list
            removeModel(index) {
                const list = this.getCurrentModelList();
                list.splice(index, 1);
            },

            // Move a model up in the list
            moveModelUp(index) {
                if (index <= 0) return;
                const list = this.getCurrentModelList();
                const temp = list[index];
                list[index] = list[index - 1];
                list[index - 1] = temp;
            },

            // Move a model down in the list
            moveModelDown(index) {
                const list = this.getCurrentModelList();
                if (index >= list.length - 1) return;
                const temp = list[index];
                list[index] = list[index + 1];
                list[index + 1] = temp;
            },

            // Save the current model list back to settings
            saveModelList() {
                console.log('Saving model list', this.currentModelType);

                // Update the appropriate model list in settings
                const modalEl = document.getElementById('settingsModal');
                const modalAD = Alpine.$data(modalEl);

                if (!modalAD || !modalAD.settings) {
                    console.error('Could not get settings from modal');
                    return;
                }

                // Initialize model lists in settings if they don't exist
                if (!modalAD.settings.chat_models) modalAD.settings.chat_models = [];
                if (!modalAD.settings.util_models) modalAD.settings.util_models = [];
                if (!modalAD.settings.embed_models) modalAD.settings.embed_models = [];
                if (!modalAD.settings.browser_models) modalAD.settings.browser_models = [];

                // Update the appropriate model list
                switch (this.currentModelType) {
                    case 'chat':
                        console.log('Saving chat models', this.chat_models);
                        modalAD.settings.chat_models = [...this.chat_models];
                        break;
                    case 'util':
                        console.log('Saving util models', this.util_models);
                        modalAD.settings.util_models = [...this.util_models];
                        break;
                    case 'embed':
                        console.log('Saving embed models', this.embed_models);
                        modalAD.settings.embed_models = [...this.embed_models];
                        break;
                    case 'browser':
                        console.log('Saving browser models', this.browser_models);
                        modalAD.settings.browser_models = [...this.browser_models];
                        break;
                }

                // Dispatch an event to update other components
                document.dispatchEvent(new CustomEvent('model-list-updated', {
                    detail: {
                        type: this.currentModelType,
                        models: this.getCurrentModelList()
                    }
                }));

                // Close the editor
                this.closeModelListEditor();
            }
        };
    });
});
