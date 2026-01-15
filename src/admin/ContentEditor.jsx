import React from 'react';

const ContentEditor = () => {
    return (
        <div className="p-12 animate-fade-in">
            <header className="mb-12">
                <h2 className="font-serif text-4xl text-omg-green mb-2">Content Editor</h2>
                <p className="font-sans text-xs uppercase tracking-widest text-omg-green/60">Manage Site Translations</p>
            </header>

            <div className="bg-white border border-omg-green/5 p-12 text-center">
                <p className="font-serif text-xl text-omg-green italic opacity-50">Database connection required to load content keys.</p>
            </div>
        </div>
    );
};

export default ContentEditor;
