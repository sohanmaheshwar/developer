const { el, mount, text, list, setChildren, setStyle, setAttr, svg } = redom

const model = {
    data: {
        svg: {
            github: { fill: "black", viewbox: "0 0 20 20", path: "M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" },
            code: { fill: "black", viewbox: "0 0 20 12", path: "M6 12L0 6L6 0L7.425 1.425L2.825 6.025L7.4 10.6L6 12ZM14 12L12.575 10.575L17.175 5.975L12.6 1.4L14 0L20 6L14 12Z" },
            external: { fill: "none", viewbox: "0 0 17 17", path: "M6 2H4.2C3.08 2 2.52 2 2.092 2.218C1.71565 2.40969 1.40969 2.71565 1.218 3.092C1 3.52 1 4.08 1 5.2V12.8C1 13.92 1 14.48 1.218 14.908C1.40974 15.2843 1.71569 15.5903 2.092 15.782C2.519 16 3.079 16 4.197 16H11.803C12.921 16 13.48 16 13.907 15.782C14.284 15.59 14.59 15.284 14.782 14.908C15 14.48 15 13.921 15 12.803V11M16 6V1M16 1H11M16 1L9 8" }
        }
    },
    actions: {
        showPreview: () => {
            developerHub.showPreview()
        },
        hidePreview: () => {
            developerHub.hidePreview()
        },
        filterContent: (tags) => {
            ContentCards.map(k => {
                k.visibility = tags.includes(k.category)
            })
            model.actions.updateContentListing(ContentCards)
        },
        updateContentListing(contentList) {
            developerHub.contentListing.update(contentList)
        }
    }
}

const languageList = ["JS/TS", "Rust", "Python", "Go", "C#", "Java", "..."]

const ContentCards = [
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "Static File Server", category: "Template", tags: "JS" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "URL Shortener", category: "Blog", tags: "Rust" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "Vue.js Application with Key Value Storage", category: "Blog", tags: "Go" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "JS2Wasm", category: "Plugin", tags: "JS" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "Set Cookie", category: "Example", tags: "befunge" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "JS2Wasm", category: "Plugin", tags: "JS" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "JS2Wasm", category: "Plugin", tags: "JS" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "JS2Wasm", category: "Plugin", tags: "JS" },
    { visibility: true, author: "Karthik2804", github: "https://github.com/karthik2804", title: "JS2Wasm", category: "Plugin", tags: "JS" }
]


class SvgIcon {
    constructor(name, path, viewBox, fill) {
        this.el = svg(
            "svg.icon", { fill: fill },
            svg("symbol", { id: name, viewBox: viewBox }, svg("path", { d: path })),
            svg("use", { xlink: { href: "#" + name } })
        )
    }
}

class TopSearch {
    constructor() {
        this.spinIcon = el("")
        this.heading = el("div.description", "WELCOME TO THE FERMYVERSE")
        this.search = el("input.search", { placeholder: "Search for spin app templates, plugins and examples" })
        this.el = el("div.top-search", this.heading, this.search)
    }
}

class CategoryListing {
    constructor() {
        this.index
        this.toggleCallback
        this.el = el("spin.category-item", {
            onclick: function (e) {
                this.toggleCallback(this.index)
            }.bind(this)
        })
    }
    update(data, index, item, context) {
        if (context) {
            this.toggleCallback = context.callback
        }
        this.index = index
        this.active = data.state
        if (this.active) {
            this.el.classList.add("active")
        } else {
            this.el.classList.remove("active")
        }
        this.el.textContent = data.name
    }
}

class ContentFilterSideBar {
    constructor() {
        this.categoriesList = list("div.categories-listing", CategoryListing)
        this.categories = [{ name: "Template", state: true }, { name: "Plugin", state: true }, { name: "Example", state: true }, { name: "Blog", state: true }]
        this.categoriesList.update(this.categories, { callback: this.toggleActive.bind(this) })

        this.el = el("div.content-filter-bar", this.categoriesList)
    }
    toggleActive(index) {
        this.categories[index]["state"] = !this.categories[index]["state"]
        this.categoriesList.update(this.categories)
        let activeCategories = []
        this.categories.map(k => { if (k.state) { activeCategories.push(k.name) } })
        model.actions.filterContent(activeCategories)
    }
}


class ContentListItem {
    constructor() {
        this.category = el("span.category")
        this.icon
        this.topbar = el("div.topbar", this.category, this.icon)
        this.author, this.author_link
        this.title = el("div.content-title")
        this.tags = el("span.tags")
        this.el = el("div.content-item-card", {
            onclick: function (e) {
                developerHub.previewPane.update({
                    title: this.title.textContent,
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    author: this.author,
                    github: this.author_link
                })
                model.actions.showPreview()
            }.bind(this)
        }, this.topbar, this.title, this.tags)
    }
    update(data, index) {
        if(!data.visibility) {
            this.el.classList.add("filtered-out")
        } else {
            this.el.classList.remove("filtered-out")
        }
        this.category.textContent = data.category
        this.title.textContent = data.title
        this.tags.textContent = data.tags
        this.author = data.author,
            this.author_link = data.github

        if (data.category == "template" || data.category == "plugin") {
            this.icon = new SvgIcon("github", model.data.svg.github.path, model.data.svg.github.viewbox, model.data.svg.github.fill)
        } else if (data.category == "blog") {
            this.icon = new SvgIcon("external", model.data.svg.external.path, model.data.svg.external.viewbox, model.data.svg.external.fill)
        } else {
            this.icon = new SvgIcon("code", model.data.svg.code.path, model.data.svg.code.viewbox, model.data.svg.code.fill)
        }

        if (index < 3) {
            this.el.classList.add("highlight")
        } else {
            this.el.classList.remove("highlight")
        }

        setChildren(this.topbar, [this.category, this.icon])
    }
}

class ContentListing {
    constructor() {
        this.el = list("div.content-listing", ContentListItem)
    }
    update(list) {
        this.el.update(list)
    }
}

class LanguageFilterItem {
    constructor() {
        this.el = el("span.language-item")
    }
    update(data) {
        this.el.textContent = data
    }
}

class LanguageFilter {
    constructor(lanaguageList) {
        this.languageList = list("div.languages-list", LanguageFilterItem)
        this.el = el("div.language-filter", this.languageList)

        // this.languageList.update(lanaguageList)
    }
}

class PreviewPane {
    constructor() {
        this.overlay = el("div.preview-overlay")

        this.closeButton = el("div.close-button", {
            onclick: function (e) {
                model.actions.hidePreview()
            }
        }, "X")
        this.title = el("div.title")
        this.author = el("a.author")
        this.description = el("div.description")

        this.url = el("a.button.is-success", "View Source")
        this.socials = el("div.socials")
        this.bottombar = el("div.bottom-bar", this.socials, this.url)

        this.modal = el("div.preview-modal", this.closeButton, this.title, this.author, this.description, this.bottombar)
        this.el = el("div.preview-wrapper", this.overlay, this.modal)

    }

    update(data) {
        this.title.textContent = data.title
        this.description.textContent = data.description
        this.author.textContent = data.author
        this.author.href = data.github
    }
}

class DeveloperHub {
    constructor() {
        this.topSearch = new TopSearch()
        this.languageFilter = new LanguageFilter(languageList)
        this.contentListing = new ContentListing()
        this.contentFilterBar = new ContentFilterSideBar()

        this.contentArea = el("div.content-area", this.contentFilterBar, this.contentListing)
        this.previewPane = new PreviewPane()

        this.el = el("div.workspace", this.topSearch, this.languageFilter, this.contentArea)
    }
    init() {
        model.actions.updateContentListing(ContentCards)
    }
    showPreview() {
        setChildren(this.el, [this.topSearch, this.languageFilter, this.contentArea, this.previewPane])
    }

    hidePreview() {
        setChildren(this.el, [this.topSearch, this.languageFilter, this.contentArea])
    }
}

let developerHub = new DeveloperHub()
developerHub.init()

mount(document.getElementById("workspace"), developerHub)