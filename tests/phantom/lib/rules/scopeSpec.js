import {expect} from 'chai';
import {createParser, setServerResponse} from '../../tools';

let parser;

describe('Using scope rule, the parser', () => {
    before(() => {
        parser = createParser();
    });

    it('should parse non existed element as empty string', async () => {
        setServerResponse('');
        const result = await parser.parse({
            rules: {
                scope: '.not-exist'
            }
        });
        expect(result).to.equal('');
    });

    it('should parse a simple node', async () => {
        setServerResponse('<div>text</div>');
        const result = await parser.parse({
            rules: {
                scope: 'div'
            }
        });
        expect(result).to.equal('text');
    });

    it('should parse an attribute of a simple node', async () => {
        setServerResponse('<div data-attr="attr"></div>');
        const result = await parser.parse({
            rules: {
                scope: 'div',
                attr: 'data-attr'
            }
        });
        expect(result).to.equal('attr');
    });

    it('should parse a simple node with parentScope', async () => {
        setServerResponse(`
            <div>wrong</div>
            <div>
                <div>text</div>
            </div>
        `);
        const result = await parser.parse({
            rules: {
                scope: 'div',
                parentScope: 'div'
            }
        });
        expect(result).to.equal('text');
    });

    it('should parse a simple nodes with separator', async () => {
        setServerResponse(`
            <div>text1</div>
            <div>text2</div>
        `);
        const result = await parser.parse({
            rules: {
                scope: 'div',
                separator: ','
            }
        });
        expect(result).to.equal('text1,text2');
    });

    it('should parse simple nodes as array', async () => {
        setServerResponse(`
            <div>text1</div>
            <div>text2</div>
        `);
        const result = await parser.parse({
            rules: {
                scope: 'div',
                type: 'array'
            }
        });
        expect(result).to.deep.equal(['text1', 'text2']);
    });
});
