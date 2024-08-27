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



describe('FormHandler', () => {
    let form;
    let title;
    let submitFn;
    let formHandler;

    beforeEach(() => {
        form = document.createElement('form');
        form.classList.add('some-class');
        form.checkValidity = jest.fn(() => true);
        form.reset = jest.fn();

        title = document.createElement('input');
        title.id = 'title';
        title.focus = jest.fn();

        form.title = { value: 'Test Title' };
        form.imageUrl = { value: 'http://example.com/image.jpg' };

        submitFn = jest.fn();
        formHandler = new View(title, submitFn);
    });

});




describe('View Class', () => {
    document.body.innerHTML = `
            <form class="needs-validation">
            <input name="title" value="Test Title" required>
            <input name="imageUrl" value="http://example.com/image.jpg" required>
            <button type="submit">Submit</button>
            </form>
            <div id="title" tabindex="0"></div>
            <div id="card-list"></div>
        `;
    let view;
    let submitMock;

    beforeEach(() => {
        view = new View();
        submitMock = jest.fn();
        view.configureOnSubmit(submitMock);
        view.initialize();
    });

    it('should call submit function with form data on valid submit', () => {
        const form = document.querySelector('.needs-validation');
        form.dispatchEvent(new Event('submit', { bubbles: true }));
        expect(submitMock).toHaveBeenCalledWith({
            title: 'Test Title',
            imageUrl: 'http://example.com/image.jpg'
        });
    });

    it('should add was-validated class on submit', () => {
        const form = document.querySelector('.needs-validation');
    
        // Simulate form submission
        form.dispatchEvent(new Event('submit', { bubbles: true }));
    
        // Assert that the form has the was-validated class
        expect(form.classList.contains('was-validated')).toBe(true);
      });
    
      it('should focus on the title element after valid submit', () => {
        const titleElement = document.querySelector('#title');
        const form = document.querySelector('.needs-validation');
    
        // Simulate form submission
        form.dispatchEvent(new Event('submit', { bubbles: true }));
    
        // Assert that the focus was set to the title element
        expect(document.activeElement).toBe(titleElement);
      });
}); 