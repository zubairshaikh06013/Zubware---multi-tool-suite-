import React from 'react';
import { SEOHead } from './SEOHead';
import { getToolSeoData } from '../data/toolSeoData';
import { getToolSeoTitle } from '../lib/seoTitles';
import { getToolCanonicalPath, getToolHowToHeading } from '../lib/paths';
import type { ToolMeta, BreadcrumbItem } from '../types';

// Keep the complete FAQ catalog out of the initial interactive application bundle.
export function ToolSEOHead({ activeTool, toolBreadcrumbList }: { activeTool: ToolMeta; toolBreadcrumbList: BreadcrumbItem[] }) {
  const isFileTool =
    activeTool.category.includes('PDF') ||
    activeTool.category.includes('Image') ||
    activeTool.category.includes('Video') ||
    activeTool.category.includes('Audio') ||
    (activeTool.features && activeTool.features.some(f => /upload|file|image|pdf|video|audio/i.test(f)));

  const isCalcOrConverter =
    activeTool.category.includes('Calculator') ||
    activeTool.category.includes('Converter') ||
    activeTool.category.includes('Financial') ||
    /calculator|converter/i.test(activeTool.title);

  const seoData = getToolSeoData(activeTool.id);
  const toolFaqs = (activeTool.faq && activeTool.faq.length > 0)
    ? activeTool.faq
    : (seoData.faq && seoData.faq.length > 0)
    ? seoData.faq
    : undefined;
  const toolHowToSteps = (activeTool.howTo && activeTool.howTo.length > 0)
    ? activeTool.howTo
    : (seoData.howTo && seoData.howTo.length > 0)
    ? seoData.howTo
    : undefined;

  const toolHowToSchema = {
    name: getToolHowToHeading(activeTool),
    description: activeTool.description,
    steps: toolHowToSteps && toolHowToSteps.length > 0
      ? toolHowToSteps.map(s => ({ name: s.title, text: s.desc }))
      : isFileTool
      ? [
          { name: 'Select or Upload Files', text: `Open ${activeTool.title} in your browser and select or drop your files into the workspace.` },
          { name: 'Configure Options', text: `Adjust options, parameters, or compression settings for ${activeTool.navTitle}.` },
          { name: 'Process & Download', text: `Generate and download your processed result directly in your browser.` }
        ]
      : isCalcOrConverter
      ? [
          { name: 'Enter Your Values', text: `Input your starting numbers, values, or parameters into ${activeTool.title}.` },
          { name: 'Select Calculation Settings', text: `Choose desired units, options, or calculation modes.` },
          { name: 'View or Copy Results', text: `Get instant, calculated results computed directly in your browser.` }
        ]
      : [
          { name: 'Input or Configure Data', text: `Enter your text, code, or parameters into ${activeTool.title}.` },
          { name: 'Process or Generate', text: `Execute the tool with your selected configuration options.` },
          { name: 'Copy or Save Output', text: `Copy the formatted output or download the resulting file.` }
        ]
  };

  return (
      <SEOHead
        title={getToolSeoTitle(activeTool)}
        description={activeTool.description}
        canonicalPath={getToolCanonicalPath(activeTool)}
        toolMeta={activeTool}
        faqs={toolFaqs}
        breadcrumbs={toolBreadcrumbList}
        howTo={toolHowToSchema}
      />
  );
}
