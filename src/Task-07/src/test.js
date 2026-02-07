import { array } from 'yargs';
import { pApp } from './pApp.js';

describe('pApp', () => {
    let el;
    let input;
    let button;
    beforeEach(() => {
        el = document.createElement("div");
        pApp(el);
        input = el.querySelector('input');
        button = el.querySelector('button');
    });

    const enterText = (text) => {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }
    const ClickOnButton = () => button.click();
    const isButtonVisible = () => !button.hidden;
    const getParagraphs = () => Array.from(el.querySelectorAll('p')).map(el => el.innerHTML);

    it('is a function', () => {
        expect(pApp).toBeInstanceOf(Function);
    });

    it("shows document elements", () => {
    // есть ввод, кнопка, 3 параграфа, кнопка не видна 
    expect(input).not.toBeNull();
    expect(button).not.toBeNull();
    expect(getParagraphs()).toEqual(["Текст параграфа 1", "Текст параграфа 2", "Текст параграфа 3"])
    expect(isButtonVisible()).toBe(false)
    });

    it("show button on entering text", () => {
        enterText('qwerty123')
        expect(isButtonVisible()).toBe(true);
    });

    it("adds paragraph with text from input", () => {
        const text = `${Math.random()}`;
        enterText(text);
        ClickOnButton();
        expect(getParagraphs()).toEqual(["Текст параграфа 1", "Текст параграфа 2", "Текст параграфа 3", text])
    });

        it("delete first paragraph if they more then 5", () => {
        const text1 = `${Math.random()}`;
        enterText(text1);
        ClickOnButton();
        const text2 = `${Math.random()}`;
        enterText(text2);
        ClickOnButton();
        const text3 = `${Math.random()}`;
        enterText(text3);
        ClickOnButton();
        expect(getParagraphs()).toEqual(["Текст параграфа 2", "Текст параграфа 3", text1, text2, text3])
    });

    it("clean input text after click", () => {
        enterText('123');
        ClickOnButton();
        expect(input.value.toBeNull);
    });

       it("button disappears when input is empty", () => {
        enterText('qqqwwwweee');
        enterText('');
        expect(isButtonVisible()).toBe(false);
    })

    it("button disappears after adding paragraph", () => {
        enterText('qqqwwwweee');
        ClickOnButton();
        expect(isButtonVisible()).toBe(false);
    })

    it("don't create 6th paragraph", () => {
            enterText('444');
            ClickOnButton();
            enterText('555');
            ClickOnButton();
            enterText('666');
            ClickOnButton();
            enterText('777');
            ClickOnButton();
            expect(getParagraphs()).toHaveLength(5);
    })

    it("possibility for long text input", () => {
            const longText = 'qwerty'.repeat(9999);
            enterText(longText);
            ClickOnButton();
            expect(getParagraphs()[3]).toEqual(longText);
    })

    it("adding paragraph with actual input text", () => {
            enterText('11111');
            enterText('');
            enterText('22222');
            enterText('');
            enterText('33333');
            ClickOnButton();
            expect(getParagraphs()[3]).toEqual('33333');
    })

    it("keep first paragraph after adding two new paragraphs", () => {
            enterText('4');
            ClickOnButton();
            enterText('5');
            ClickOnButton();
            expect(getParagraphs()[0]).toEqual('Текст параграфа 1');
    })
    
    it("second paragrpaph become first after adding three new paragraphs", () => {
            enterText('4');
            ClickOnButton();
            enterText('5');
            ClickOnButton();
            enterText('6');
            ClickOnButton();
            expect(getParagraphs()[0]).toEqual('Текст параграфа 2');
    })
    })