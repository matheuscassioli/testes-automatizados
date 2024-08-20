import { describe, it, jest, expect } from '@jest/globals'
import View from "../../public/src/view.js"

describe('View test suite', () => {

    it('#updateList should append content to card-list innerHTML', () => {
        const baseHTML = '<div></div>'
        const innerHTMLSpy = jest.fn()
        const queeySelectorProxy = new Proxy({
            innerHTML: baseHTML
        }, {
            set(obj, key, value) {
                obj[key] = value
                innerHTMLSpy(obj[key])
                return true
            }
        })

        jest.spyOn(document, document.querySelector.name).mockImplementation((key => {
            if (key !== '#card-list') return
            return queeySelectorProxy
        }))

        const view = new View()

        const data = {
            title: 'title',
            imageUrl: 'https://img.com/img.png'
        }

        const generatedContent =
            ` <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="${data.imageUrl}"
                            alt="Image of an ${data.title}">
                        <figcaption>
                            <h4 class="card-title">${data.title}</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>`;

        view.updateList([data]);

        const normalizeWhitespace = (str) => str.replace(/\s+/g, ' ').trim();

        expect(normalizeWhitespace(innerHTMLSpy.mock.calls[0][0])).toBe(
            normalizeWhitespace(baseHTML + generatedContent)
        )

        view.updateList([data]);

        expect(normalizeWhitespace(innerHTMLSpy.mock.calls[0][0])).toBe(
            normalizeWhitespace(baseHTML + generatedContent)
        )

    })

    let view;
    beforeEach(() => {
        document.body.innerHTML = `
                <form class="needs-validation" id="form-1">
                    <input name="title" required />
                    <input name="imageUrl" required />
                    <button type="submit">Submit</button>
                </form> 
                <div id="title"></div>
                <div id="card-list"></div>
            `;

        view = new View();
    });

    it('initialize should initialize and listen to events on the form', () => {
        const forms = document.querySelectorAll('.needs-validation');
        const addEventListenerSpy = jest.spyOn(forms[0], 'addEventListener');
        view.initialize();
        expect(addEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function), false);
    });
 
})


