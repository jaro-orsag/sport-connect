import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    constructor(private meta: Meta, private title: Title) { }

    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    updateMetaTags(metaTags: { name: string, content: string }[]) {
        this.meta.removeTag('name="robots"');
        metaTags.forEach(tag => {
            this.meta.updateTag({ name: tag.name, content: tag.content });
        });
    }

    setNoIndex() {
        this.meta.updateTag({ name: 'robots', content: 'noindex' });
    }
}
