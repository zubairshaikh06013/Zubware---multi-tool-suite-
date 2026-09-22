import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Breadcrumb } from './components/Breadcrumb';
import { BackButton } from './components/BackButton';
import { SEOHead } from './components/SEOHead';
import { AdSlot } from './components/AdSlot';
import { ToolRecommendations } from './components/ToolRecommendations';
import { InstallBanner } from './components/InstallBanner';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AccessibilityWrapper } from './components/AccessibilityWrapper';
import { toggleFavorite } from './lib/userStore';
import { ToolErrorBoundary } from './components/ToolErrorBoundary';
import { lazyWithRetry } from './lib/lazyWithRetry';

// Platform Pages
const DashboardPage = lazy(() => import('./components/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CategoryPage = lazy(() => import('./components/pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const HelpPage = lazy(() => import('./components/pages/HelpPage').then(m => ({ default: m.HelpPage })));
const ChangelogPage = lazy(() => import('./components/pages/ChangelogPage').then(m => ({ default: m.ChangelogPage })));
const FeedbackPage = lazy(() => import('./components/pages/FeedbackPage').then(m => ({ default: m.FeedbackPage })));

// Lazy loaded tool components
const SplitDropHero = lazy(() => import('./components/tools/SplitDropHero').then(m => ({ default: m.SplitDropHero })));
const BackgroundRemoverTool = lazy(() => import('./components/tools/image/BackgroundRemoverTool').then(m => ({ default: m.BackgroundRemoverTool })));
const ImageCompressorTool = lazy(() => import('./components/tools/ImageCompressorTool').then(m => ({ default: m.ImageCompressorTool })));
const ImageConverterTool = lazy(() => import('./components/tools/ImageConverterTool').then(m => ({ default: m.ImageConverterTool })));
const ImageResizerTool = lazy(() => import('./components/tools/image/ImageResizerTool').then(m => ({ default: m.ImageResizerTool })));
const CropImageTool = lazy(() => import('./components/tools/image/CropImageTool').then(m => ({ default: m.CropImageTool })));
const RotateImageTool = lazy(() => import('./components/tools/image/RotateImageTool').then(m => ({ default: m.RotateImageTool })));
const FlipImageTool = lazy(() => import('./components/tools/image/FlipImageTool').then(m => ({ default: m.FlipImageTool })));
const WatermarkImageTool = lazy(() => import('./components/tools/image/WatermarkImageTool').then(m => ({ default: m.WatermarkImageTool })));
const BlurImageTool = lazy(() => import('./components/tools/image/BlurImageTool').then(m => ({ default: m.BlurImageTool })));
const PixelateImageTool = lazy(() => import('./components/tools/image/PixelateImageTool').then(m => ({ default: m.PixelateImageTool })));
const ExifRemoverTool = lazy(() => import('./components/tools/image/ExifRemoverTool').then(m => ({ default: m.ExifRemoverTool })));
const ColorPickerTool = lazy(() => import('./components/tools/image/ColorPickerTool').then(m => ({ default: m.ColorPickerTool })));
const ImageInfoViewerTool = lazy(() => import('./components/tools/image/ImageInfoViewerTool').then(m => ({ default: m.ImageInfoViewerTool })));

const BackgroundColorChangerTool = lazy(() => import('./components/tools/image/BackgroundColorChangerTool').then(m => ({ default: m.BackgroundColorChangerTool })));
const RoundedCornerGeneratorTool = lazy(() => import('./components/tools/image/RoundedCornerGeneratorTool').then(m => ({ default: m.RoundedCornerGeneratorTool })));
const ImageBorderGeneratorTool = lazy(() => import('./components/tools/image/ImageBorderGeneratorTool').then(m => ({ default: m.ImageBorderGeneratorTool })));
const ImageFrameGeneratorTool = lazy(() => import('./components/tools/image/ImageFrameGeneratorTool').then(m => ({ default: m.ImageFrameGeneratorTool })));
const ImageCollageMakerTool = lazy(() => import('./components/tools/image/ImageCollageMakerTool').then(m => ({ default: m.ImageCollageMakerTool })));
const FaviconGeneratorTool = lazy(() => import('./components/tools/image/FaviconGeneratorTool').then(m => ({ default: m.FaviconGeneratorTool })));
const SvgOptimizerTool = lazy(() => import('./components/tools/image/SvgOptimizerTool').then(m => ({ default: m.SvgOptimizerTool })));
const GifMakerTool = lazy(() => import('./components/tools/image/GifMakerTool').then(m => ({ default: m.GifMakerTool })));
const BatchImageConverterTool = lazy(() => import('./components/tools/image/BatchImageConverterTool').then(m => ({ default: m.BatchImageConverterTool })));
const ImageCompressionComparisonTool = lazy(() => import('./components/tools/image/ImageCompressionComparisonTool').then(m => ({ default: m.ImageCompressionComparisonTool })));
const HeicToJpgTool = lazy(() => import('./components/tools/image/HeicToJpgTool').then(m => ({ default: m.HeicToJpgTool })));
const BulkImageRenamerResizerTool = lazy(() => import('./components/tools/image/BulkImageRenamerResizerTool').then(m => ({ default: m.BulkImageRenamerResizerTool })));
const PassportPhotoMakerTool = lazy(() => import('./components/tools/image/PassportPhotoMakerTool').then(m => ({ default: m.PassportPhotoMakerTool })));
const MatchingPartsPuzzleVideoMakerTool = lazy(() => import('./components/tools/video/MatchingPartsPuzzleVideoMakerTool').then(m => ({ default: m.MatchingPartsPuzzleVideoMakerTool })));
const LofiMusicStudioTool = lazy(() => import('./components/tools/audio/LofiMusicStudioTool').then(m => ({ default: m.LofiMusicStudioTool })));
const LofiMakerTool = lazy(() => import('./components/tools/audio/LofiMakerTool').then(m => ({ default: m.LofiMakerTool })));
const SlowedAndReverbTool = lazy(() => import('./components/tools/audio/SlowedAndReverbTool').then(m => ({ default: m.SlowedAndReverbTool })));
const GstInvoiceGeneratorTool = lazy(() => import('./components/tools/business/GstInvoiceGeneratorTool').then(m => ({ default: m.GstInvoiceGeneratorTool })));

const PdfMergeTool = lazy(() => import('./components/tools/PdfMergeTool').then(m => ({ default: m.PdfMergeTool })));
const PdfSplitTool = lazy(() => import('./components/tools/PdfSplitTool').then(m => ({ default: m.PdfSplitTool })));
const QrGeneratorTool = lazy(() => import('./components/tools/QrGeneratorTool').then(m => ({ default: m.QrGeneratorTool })));
const ResumeBuilderTool = lazy(() => import('./components/tools/ResumeBuilderTool').then(m => ({ default: m.ResumeBuilderTool })));

// Career Tools
const AtsResumeCheckerTool = lazy(() => import('./components/tools/career/AtsResumeCheckerTool').then(m => ({ default: m.AtsResumeCheckerTool })));
const ResumeScoreAnalyzerTool = lazy(() => import('./components/tools/career/ResumeScoreAnalyzerTool').then(m => ({ default: m.ResumeScoreAnalyzerTool })));
const CoverLetterBuilderTool = lazy(() => import('./components/tools/career/CoverLetterBuilderTool').then(m => ({ default: m.CoverLetterBuilderTool })));
const CoverLetterTemplatesTool = lazy(() => import('./components/tools/career/CoverLetterTemplatesTool').then(m => ({ default: m.CoverLetterTemplatesTool })));
const CvBuilderTool = lazy(() => import('./components/tools/career/CvBuilderTool').then(m => ({ default: m.CvBuilderTool })));
const ResumeKeywordOptimizerTool = lazy(() => import('./components/tools/career/ResumeKeywordOptimizerTool').then(m => ({ default: m.ResumeKeywordOptimizerTool })));
const ResumeTemplateGalleryTool = lazy(() => import('./components/tools/career/ResumeTemplateGalleryTool').then(m => ({ default: m.ResumeTemplateGalleryTool })));
const ResumeVersionManagerTool = lazy(() => import('./components/tools/career/ResumeVersionManagerTool').then(m => ({ default: m.ResumeVersionManagerTool })));
const ResumeImportTool = lazy(() => import('./components/tools/career/ResumeImportTool').then(m => ({ default: m.ResumeImportTool })));
const ResumeExportTool = lazy(() => import('./components/tools/career/ResumeExportTool').then(m => ({ default: m.ResumeExportTool })));
const ResumeCompletenessTool = lazy(() => import('./components/tools/career/ResumeCompletenessTool').then(m => ({ default: m.ResumeCompletenessTool })));
const ResumeSectionManagerTool = lazy(() => import('./components/tools/career/ResumeSectionManagerTool').then(m => ({ default: m.ResumeSectionManagerTool })));
const ProfessionalSkillLibraryTool = lazy(() => import('./components/tools/career/ProfessionalSkillLibraryTool').then(m => ({ default: m.ProfessionalSkillLibraryTool })));
const SummaryGeneratorTool = lazy(() => import('./components/tools/career/SummaryGeneratorTool').then(m => ({ default: m.SummaryGeneratorTool })));
const ResumeColorThemesTool = lazy(() => import('./components/tools/career/ResumeColorThemesTool').then(m => ({ default: m.ResumeColorThemesTool })));
const ExperienceCalculatorTool = lazy(() => import('./components/tools/career/ExperienceCalculatorTool').then(m => ({ default: m.ExperienceCalculatorTool })));
const NoticePeriodCalculatorTool = lazy(() => import('./components/tools/career/NoticePeriodCalculatorTool').then(m => ({ default: m.NoticePeriodCalculatorTool })));
const SalaryHikeCalculatorTool = lazy(() => import('./components/tools/career/SalaryHikeCalculatorTool').then(m => ({ default: m.SalaryHikeCalculatorTool })));
const CtcCalculatorTool = lazy(() => import('./components/tools/career/CtcCalculatorTool').then(m => ({ default: m.CtcCalculatorTool })));
const WorkingDaysCalculatorTool = lazy(() => import('./components/tools/career/WorkingDaysCalculatorTool').then(m => ({ default: m.WorkingDaysCalculatorTool })));

// Creator & Social Media Tools
const YouTubeTitleGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTitleGeneratorTool').then(m => ({ default: m.YouTubeTitleGeneratorTool })));
const YouTubeDescriptionGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeDescriptionGeneratorTool').then(m => ({ default: m.YouTubeDescriptionGeneratorTool })));
const YouTubeTagsGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTagsGeneratorTool').then(m => ({ default: m.YouTubeTagsGeneratorTool })));
const YouTubeHashtagGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeHashtagGeneratorTool').then(m => ({ default: m.YouTubeHashtagGeneratorTool })));
const YouTubeThumbnailPreviewTool = lazy(() => import('./components/tools/creator/YouTubeThumbnailPreviewTool').then(m => ({ default: m.YouTubeThumbnailPreviewTool })));
const YouTubeThumbnailSimulatorTool = lazy(() => import('./components/tools/creator/YouTubeThumbnailSimulatorTool').then(m => ({ default: m.YouTubeThumbnailSimulatorTool })));
const YouTubeBannerSafeAreaTool = lazy(() => import('./components/tools/creator/YouTubeBannerSafeAreaTool').then(m => ({ default: m.YouTubeBannerSafeAreaTool })));
const YouTubeChannelNameGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeChannelNameGeneratorTool').then(m => ({ default: m.YouTubeChannelNameGeneratorTool })));
const YouTubeVideoIdeaGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeVideoIdeaGeneratorTool').then(m => ({ default: m.YouTubeVideoIdeaGeneratorTool })));
const YouTubePlaylistNameGeneratorTool = lazy(() => import('./components/tools/creator/YouTubePlaylistNameGeneratorTool').then(m => ({ default: m.YouTubePlaylistNameGeneratorTool })));
const YouTubeTimestampGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTimestampGeneratorTool').then(m => ({ default: m.YouTubeTimestampGeneratorTool })));
const YouTubeDescriptionFormatterTool = lazy(() => import('./components/tools/creator/YouTubeDescriptionFormatterTool').then(m => ({ default: m.YouTubeDescriptionFormatterTool })));
const ThumbnailTextGeneratorTool = lazy(() => import('./components/tools/creator/ThumbnailTextGeneratorTool').then(m => ({ default: m.ThumbnailTextGeneratorTool })));
const ViralHookGeneratorTool = lazy(() => import('./components/tools/creator/ViralHookGeneratorTool').then(m => ({ default: m.ViralHookGeneratorTool })));
const CtaGeneratorTool = lazy(() => import('./components/tools/creator/CtaGeneratorTool').then(m => ({ default: m.CtaGeneratorTool })));
const SocialCharacterCounterTool = lazy(() => import('./components/tools/creator/SocialCharacterCounterTool').then(m => ({ default: m.SocialCharacterCounterTool })));
const EmojiGeneratorTool = lazy(() => import('./components/tools/creator/EmojiGeneratorTool').then(m => ({ default: m.EmojiGeneratorTool })));
const InstagramCaptionGeneratorTool = lazy(() => import('./components/tools/creator/InstagramCaptionGeneratorTool').then(m => ({ default: m.InstagramCaptionGeneratorTool })));
const InstagramHashtagGeneratorTool = lazy(() => import('./components/tools/creator/InstagramHashtagGeneratorTool').then(m => ({ default: m.InstagramHashtagGeneratorTool })));
const InstagramBioGeneratorTool = lazy(() => import('./components/tools/creator/InstagramBioGeneratorTool').then(m => ({ default: m.InstagramBioGeneratorTool })));
const InstagramUsernameGeneratorTool = lazy(() => import('./components/tools/creator/InstagramUsernameGeneratorTool').then(m => ({ default: m.InstagramUsernameGeneratorTool })));
const TikTokCaptionGeneratorTool = lazy(() => import('./components/tools/creator/TikTokCaptionGeneratorTool').then(m => ({ default: m.TikTokCaptionGeneratorTool })));
const TikTokHashtagGeneratorTool = lazy(() => import('./components/tools/creator/TikTokHashtagGeneratorTool').then(m => ({ default: m.TikTokHashtagGeneratorTool })));
const FacebookCaptionGeneratorTool = lazy(() => import('./components/tools/creator/FacebookCaptionGeneratorTool').then(m => ({ default: m.FacebookCaptionGeneratorTool })));
const FacebookHashtagGeneratorTool = lazy(() => import('./components/tools/creator/FacebookHashtagGeneratorTool').then(m => ({ default: m.FacebookHashtagGeneratorTool })));
const LinkedInHeadlineGeneratorTool = lazy(() => import('./components/tools/creator/LinkedInHeadlineGeneratorTool').then(m => ({ default: m.LinkedInHeadlineGeneratorTool })));
const LinkedInSummaryGeneratorTool = lazy(() => import('./components/tools/creator/LinkedInSummaryGeneratorTool').then(m => ({ default: m.LinkedInSummaryGeneratorTool })));
const TwitterBioGeneratorTool = lazy(() => import('./components/tools/creator/TwitterBioGeneratorTool').then(m => ({ default: m.TwitterBioGeneratorTool })));
const UniversalHashtagGeneratorTool = lazy(() => import('./components/tools/creator/UniversalHashtagGeneratorTool').then(m => ({ default: m.UniversalHashtagGeneratorTool })));
const FancyTextGeneratorTool = lazy(() => import('./components/tools/creator/FancyTextGeneratorTool').then(m => ({ default: m.FancyTextGeneratorTool })));
const UnicodeFontGeneratorTool = lazy(() => import('./components/tools/creator/UnicodeFontGeneratorTool').then(m => ({ default: m.UnicodeFontGeneratorTool })));
const TextDecoratorTool = lazy(() => import('./components/tools/creator/TextDecoratorTool').then(m => ({ default: m.TextDecoratorTool })));
const EmojiCombinerTool = lazy(() => import('./components/tools/creator/EmojiCombinerTool').then(m => ({ default: m.EmojiCombinerTool })));
const SocialMediaPostFormatterTool = lazy(() => import('./components/tools/creator/SocialMediaPostFormatterTool').then(m => ({ default: m.SocialMediaPostFormatterTool })));
const SocialBioLinkBuilderTool = lazy(() => import('./components/tools/creator/SocialBioLinkBuilderTool').then(m => ({ default: m.SocialBioLinkBuilderTool })));
const IslamicShortsMakerTool = lazy(() => import('./components/tools/creator/IslamicShortsMakerTool').then(m => ({ default: m.IslamicShortsMakerTool })));
const ScriptToVideoMakerTool = lazy(() => import('./components/tools/creator/ScriptToVideoMakerTool').then(m => ({ default: m.ScriptToVideoMakerTool })));

// PDF Tools
const ImageToPdfTool = lazy(() => import('./components/tools/pdf/ImageToPdfTool').then(m => ({ default: m.ImageToPdfTool })));
const PdfToImagesTool = lazy(() => import('./components/tools/pdf/PdfToImagesTool').then(m => ({ default: m.PdfToImagesTool })));
const RotatePdfTool = lazy(() => import('./components/tools/pdf/RotatePdfTool').then(m => ({ default: m.RotatePdfTool })));
const DeletePdfPagesTool = lazy(() => import('./components/tools/pdf/DeletePdfPagesTool').then(m => ({ default: m.DeletePdfPagesTool })));
const ExtractPdfPagesTool = lazy(() => import('./components/tools/pdf/ExtractPdfPagesTool').then(m => ({ default: m.ExtractPdfPagesTool })));
const ReorderPdfPagesTool = lazy(() => import('./components/tools/pdf/ReorderPdfPagesTool').then(m => ({ default: m.ReorderPdfPagesTool })));
const PdfWatermarkTool = lazy(() => import('./components/tools/pdf/PdfWatermarkTool').then(m => ({ default: m.PdfWatermarkTool })));
const ProtectPdfTool = lazy(() => import('./components/tools/pdf/ProtectPdfTool').then(m => ({ default: m.ProtectPdfTool })));
const UnlockPdfTool = lazy(() => import('./components/tools/pdf/UnlockPdfTool').then(m => ({ default: m.UnlockPdfTool })));
const PdfMetadataTool = lazy(() => import('./components/tools/pdf/PdfMetadataTool').then(m => ({ default: m.PdfMetadataTool })));

// Developer Tools
const UuidGeneratorTool = lazy(() => import('./components/tools/dev/UuidGeneratorTool').then(m => ({ default: m.UuidGeneratorTool })));
const HashGeneratorTool = lazy(() => import('./components/tools/dev/HashGeneratorTool').then(m => ({ default: m.HashGeneratorTool })));
const JwtDecoderTool = lazy(() => import('./components/tools/dev/JwtDecoderTool').then(m => ({ default: m.JwtDecoderTool })));
const UnixTimestampConverterTool = lazy(() => import('./components/tools/dev/UnixTimestampConverterTool').then(m => ({ default: m.UnixTimestampConverterTool })));
const RegexTesterTool = lazy(() => import('./components/tools/dev/RegexTesterTool').then(m => ({ default: m.RegexTesterTool })));
const JsonFormatterTool = lazy(() => import('./components/tools/dev/JsonFormatterTool').then(m => ({ default: m.JsonFormatterTool })));
const JsonValidatorTool = lazy(() => import('./components/tools/dev/JsonValidatorTool').then(m => ({ default: m.JsonValidatorTool })));
const JsonToCsvTool = lazy(() => import('./components/tools/dev/JsonToCsvTool').then(m => ({ default: m.JsonToCsvTool })));
const CsvToJsonTool = lazy(() => import('./components/tools/dev/CsvToJsonTool').then(m => ({ default: m.CsvToJsonTool })));
const CsvViewerTool = lazy(() => import('./components/tools/dev/CsvViewerTool').then(m => ({ default: m.CsvViewerTool })));
const WebsiteDownloaderTool = lazy(() => import('./components/tools/dev/WebsiteDownloaderTool').then(m => ({ default: m.WebsiteDownloaderTool })));
const HtmlFormatterTool = lazy(() => import('./components/tools/dev/HtmlFormatterTool').then(m => ({ default: m.HtmlFormatterTool })));
const CssFormatterTool = lazy(() => import('./components/tools/dev/CssFormatterTool').then(m => ({ default: m.CssFormatterTool })));
const JsFormatterTool = lazy(() => import('./components/tools/dev/JsFormatterTool').then(m => ({ default: m.JsFormatterTool })));
const XmlFormatterTool = lazy(() => import('./components/tools/dev/XmlFormatterTool').then(m => ({ default: m.XmlFormatterTool })));
const XmlValidatorTool = lazy(() => import('./components/tools/dev/XmlValidatorTool').then(m => ({ default: m.XmlValidatorTool })));
const UrlParserTool = lazy(() => import('./components/tools/dev/UrlParserTool').then(m => ({ default: m.UrlParserTool })));
const UrlEncoderDecoderTool = lazy(() => import('./components/tools/dev/UrlEncoderDecoderTool').then(m => ({ default: m.UrlEncoderDecoderTool })));
const Base64EncoderDecoderTool = lazy(() => import('./components/tools/dev/Base64EncoderDecoderTool').then(m => ({ default: m.Base64EncoderDecoderTool })));
const HtmlEscapeUnescapeTool = lazy(() => import('./components/tools/dev/HtmlEscapeUnescapeTool').then(m => ({ default: m.HtmlEscapeUnescapeTool })));
const HttpHeaderViewerTool = lazy(() => import('./components/tools/dev/HttpHeaderViewerTool').then(m => ({ default: m.HttpHeaderViewerTool })));
const ApiRequestBuilderTool = lazy(() => import('./components/tools/dev/ApiRequestBuilderTool').then(m => ({ default: m.ApiRequestBuilderTool })));
const ColorConverterTool = lazy(() => import('./components/tools/dev/ColorConverterTool').then(m => ({ default: m.ColorConverterTool })));
const QrCodeDecoderTool = lazy(() => import('./components/tools/dev/QrCodeDecoderTool').then(m => ({ default: m.QrCodeDecoderTool })));

// Design & Utility Tools
const CssGradientGeneratorTool = lazy(() => import('./components/tools/design/CssGradientGeneratorTool').then(m => ({ default: m.CssGradientGeneratorTool })));
const BoxShadowGeneratorTool = lazy(() => import('./components/tools/design/BoxShadowGeneratorTool').then(m => ({ default: m.BoxShadowGeneratorTool })));
const BorderRadiusGeneratorTool = lazy(() => import('./components/tools/design/BorderRadiusGeneratorTool').then(m => ({ default: m.BorderRadiusGeneratorTool })));
const GlassmorphismGeneratorTool = lazy(() => import('./components/tools/design/GlassmorphismGeneratorTool').then(m => ({ default: m.GlassmorphismGeneratorTool })));
const NeumorphismGeneratorTool = lazy(() => import('./components/tools/design/NeumorphismGeneratorTool').then(m => ({ default: m.NeumorphismGeneratorTool })));
const CssClipPathGeneratorTool = lazy(() => import('./components/tools/design/CssClipPathGeneratorTool').then(m => ({ default: m.CssClipPathGeneratorTool })));
const SvgShapeGeneratorTool = lazy(() => import('./components/tools/design/SvgShapeGeneratorTool').then(m => ({ default: m.SvgShapeGeneratorTool })));
const ColorPaletteGeneratorTool = lazy(() => import('./components/tools/design/ColorPaletteGeneratorTool').then(m => ({ default: m.ColorPaletteGeneratorTool })));
const ContrastCheckerTool = lazy(() => import('./components/tools/design/ContrastCheckerTool').then(m => ({ default: m.ContrastCheckerTool })));
const RandomColorGeneratorTool = lazy(() => import('./components/tools/design/RandomColorGeneratorTool').then(m => ({ default: m.RandomColorGeneratorTool })));
const QrBusinessCardGeneratorTool = lazy(() => import('./components/tools/design/QrBusinessCardGeneratorTool').then(m => ({ default: m.QrBusinessCardGeneratorTool })));
const UnitConverterTool = lazy(() => import('./components/tools/design/UnitConverterTool').then(m => ({ default: m.UnitConverterTool })));
const PercentageCalculatorTool = lazy(() => import('./components/tools/design/PercentageCalculatorTool').then(m => ({ default: m.PercentageCalculatorTool })));
const AgeCalculatorTool = lazy(() => import('./components/tools/design/AgeCalculatorTool').then(m => ({ default: m.AgeCalculatorTool })));
const EmiCalculatorTool = lazy(() => import('./components/tools/design/EmiCalculatorTool').then(m => ({ default: m.EmiCalculatorTool })));
const DiscountCalculatorTool = lazy(() => import('./components/tools/design/DiscountCalculatorTool').then(m => ({ default: m.DiscountCalculatorTool })));
const CurrencyCalculatorTool = lazy(() => import('./components/tools/design/CurrencyCalculatorTool').then(m => ({ default: m.CurrencyCalculatorTool })));
const TipCalculatorTool = lazy(() => import('./components/tools/design/TipCalculatorTool').then(m => ({ default: m.TipCalculatorTool })));
const RandomNumberGeneratorTool = lazy(() => import('./components/tools/design/RandomNumberGeneratorTool').then(m => ({ default: m.RandomNumberGeneratorTool })));
const RandomPasswordGeneratorTool = lazy(() => import('./components/tools/design/RandomPasswordGeneratorTool').then(m => ({ default: m.RandomPasswordGeneratorTool })));
const NumberToWordsTool = lazy(() => import('./components/tools/text/NumberToWordsTool').then(m => ({ default: m.NumberToWordsTool })));
const WordsToNumberTool = lazy(() => import('./components/tools/text/WordsToNumberTool').then(m => ({ default: m.WordsToNumberTool })));
const RomanNumeralConverterTool = lazy(() => import('./components/tools/text/RomanNumeralConverterTool').then(m => ({ default: m.RomanNumeralConverterTool })));
const LoanMortgageCalculatorTool = lazy(() => import('./components/tools/business/LoanMortgageCalculatorTool').then(m => ({ default: m.LoanMortgageCalculatorTool })));
const RoiProfitMarginCalculatorTool = lazy(() => import('./components/tools/business/RoiProfitMarginCalculatorTool').then(m => ({ default: m.RoiProfitMarginCalculatorTool })));
const CompoundInterestCalculatorTool = lazy(() => import('./components/tools/business/CompoundInterestCalculatorTool').then(m => ({ default: m.CompoundInterestCalculatorTool })));
const LearningLicenceMockTest = lazy(() => import('./components/tools/business/LearningLicenceMockTest').then(m => ({ default: m.LearningLicenceMockTest })));

// AI Prompt Builder Tools
const ChatgptPromptBuilderTool = lazy(() => import('./components/tools/prompt/ChatgptPromptBuilderTool').then(m => ({ default: m.ChatgptPromptBuilderTool })));
const GeminiPromptBuilderTool = lazy(() => import('./components/tools/prompt/GeminiPromptBuilderTool').then(m => ({ default: m.GeminiPromptBuilderTool })));
const ClaudePromptBuilderTool = lazy(() => import('./components/tools/prompt/ClaudePromptBuilderTool').then(m => ({ default: m.ClaudePromptBuilderTool })));
const VeoPromptBuilderTool = lazy(() => import('./components/tools/prompt/VeoPromptBuilderTool').then(m => ({ default: m.VeoPromptBuilderTool })));
const MidjourneyPromptBuilderTool = lazy(() => import('./components/tools/prompt/MidjourneyPromptBuilderTool').then(m => ({ default: m.MidjourneyPromptBuilderTool })));
const FluxPromptBuilderTool = lazy(() => import('./components/tools/prompt/FluxPromptBuilderTool').then(m => ({ default: m.FluxPromptBuilderTool })));
const StableDiffusionPromptBuilderTool = lazy(() => import('./components/tools/prompt/StableDiffusionPromptBuilderTool').then(m => ({ default: m.StableDiffusionPromptBuilderTool })));
const LogoPromptBuilderTool = lazy(() => import('./components/tools/prompt/LogoPromptBuilderTool').then(m => ({ default: m.LogoPromptBuilderTool })));
const ThumbnailPromptBuilderTool = lazy(() => import('./components/tools/prompt/ThumbnailPromptBuilderTool').then(m => ({ default: m.ThumbnailPromptBuilderTool })));
const ProductPhotoPromptBuilderTool = lazy(() => import('./components/tools/prompt/ProductPhotoPromptBuilderTool').then(m => ({ default: m.ProductPhotoPromptBuilderTool })));
const InteriorDesignPromptBuilderTool = lazy(() => import('./components/tools/prompt/InteriorDesignPromptBuilderTool').then(m => ({ default: m.InteriorDesignPromptBuilderTool })));
const StoryPromptBuilderTool = lazy(() => import('./components/tools/prompt/StoryPromptBuilderTool').then(m => ({ default: m.StoryPromptBuilderTool })));
const YoutubeScriptPromptBuilderTool = lazy(() => import('./components/tools/prompt/YoutubeScriptPromptBuilderTool').then(m => ({ default: m.YoutubeScriptPromptBuilderTool })));
const ResumePromptBuilderTool = lazy(() => import('./components/tools/prompt/ResumePromptBuilderTool').then(m => ({ default: m.ResumePromptBuilderTool })));
const CoverLetterPromptBuilderTool = lazy(() => import('./components/tools/prompt/CoverLetterPromptBuilderTool').then(m => ({ default: m.CoverLetterPromptBuilderTool })));
const EmailPromptBuilderTool = lazy(() => import('./components/tools/prompt/EmailPromptBuilderTool').then(m => ({ default: m.EmailPromptBuilderTool })));
const SocialMediaPromptBuilderTool = lazy(() => import('./components/tools/prompt/SocialMediaPromptBuilderTool').then(m => ({ default: m.SocialMediaPromptBuilderTool })));
const SeoPromptBuilderTool = lazy(() => import('./components/tools/prompt/SeoPromptBuilderTool').then(m => ({ default: m.SeoPromptBuilderTool })));
const CodingPromptBuilderTool = lazy(() => import('./components/tools/prompt/CodingPromptBuilderTool').then(m => ({ default: m.CodingPromptBuilderTool })));
const UniversalPromptBuilderTool = lazy(() => import('./components/tools/prompt/UniversalPromptBuilderTool').then(m => ({ default: m.UniversalPromptBuilderTool })));
const QrCodeSafetyCheckerTool = lazy(() => import('./components/tools/security/QrCodeSafetyCheckerTool').then(m => ({ default: m.QrCodeSafetyCheckerTool })));
const WeightGainCalculatorTool = lazy(() => import('./components/tools/health/WeightGainCalculatorTool').then(m => ({ default: m.WeightGainCalculatorTool })));
const PdfSizeAdjusterTool = lazy(() => import('./components/tools/pdf/PdfSizeAdjusterTool').then(m => ({ default: m.PdfSizeAdjusterTool })));
const IncreasePdfSizeTool = lazy(() => import('./components/tools/pdf/IncreasePdfSizeTool').then(m => ({ default: m.IncreasePdfSizeTool })));
const DecreasePdfSizeTool = lazy(() => import('./components/tools/pdf/DecreasePdfSizeTool').then(m => ({ default: m.DecreasePdfSizeTool })));
const PdfCompressorTool = lazy(() => import('./components/tools/pdf/PdfCompressorTool').then(m => ({ default: m.PdfCompressorTool })));
const PdfToJpgTool = lazy(() => import('./components/tools/pdf/PdfToJpgTool').then(m => ({ default: m.PdfToJpgTool })));
const EditPdfTool = lazy(() => import('./components/tools/pdf/EditPdfTool').then(m => ({ default: m.EditPdfTool })));
const TextToPdfTool = lazy(() => import('./components/tools/pdf/TextToPdfTool').then(m => ({ default: m.TextToPdfTool })));
const SignatureMakerTool = lazy(() => import('./components/tools/image/SignatureMakerTool').then(m => ({ default: m.SignatureMakerTool })));
const SignatureResizerTool = lazy(() => import('./components/tools/image/SignatureResizerTool').then(m => ({ default: m.SignatureResizerTool })));
const PhotoSignatureJoinerTool = lazy(() => import('./components/tools/image/PhotoSignatureJoinerTool').then(m => ({ default: m.PhotoSignatureJoinerTool })));
const PhotoNameDateJoinerTool = lazy(() => import('./components/tools/image/PhotoNameDateJoinerTool').then(m => ({ default: m.PhotoNameDateJoinerTool })));
const TextToHandwritingTool = lazy(() => import('./components/tools/image/TextToHandwritingTool').then(m => ({ default: m.TextToHandwritingTool })));
const OmrSheetGeneratorTool = lazy(() => import('./components/tools/business/OmrSheetGeneratorTool').then(m => ({ default: m.OmrSheetGeneratorTool })));
const BarcodeGeneratorTool = lazy(() => import('./components/tools/business/BarcodeGeneratorTool').then(m => ({ default: m.BarcodeGeneratorTool })));

// PDF Suite Additions
const PdfToWordTool = lazy(() => import('./components/tools/pdf/PdfToWordTool').then(m => ({ default: m.PdfToWordTool })));
const WordToPdfTool = lazy(() => import('./components/tools/pdf/WordToPdfTool').then(m => ({ default: m.WordToPdfTool })));
const PdfToTextTool = lazy(() => import('./components/tools/pdf/PdfToTextTool').then(m => ({ default: m.PdfToTextTool })));
const PdfToExcelTool = lazy(() => import('./components/tools/pdf/PdfToExcelTool').then(m => ({ default: m.PdfToExcelTool })));
const PdfPageNumberTool = lazy(() => import('./components/tools/pdf/PdfPageNumberTool').then(m => ({ default: m.PdfPageNumberTool })));
const PdfCompareTool = lazy(() => import('./components/tools/pdf/PdfCompareTool').then(m => ({ default: m.PdfCompareTool })));
const PdfSignatureTool = lazy(() => import('./components/tools/pdf/PdfSignatureTool').then(m => ({ default: m.PdfSignatureTool })));

// Text & Writing Suite Additions
const CaseConverterTool = lazy(() => import('./components/tools/text/CaseConverterTool').then(m => ({ default: m.CaseConverterTool })));
const WordCounterTool = lazy(() => import('./components/tools/text/WordCounterTool').then(m => ({ default: m.WordCounterTool })));
const CharacterCounterTool = lazy(() => import('./components/tools/text/CharacterCounterTool').then(m => ({ default: m.CharacterCounterTool })));
const ReadingTimeCalculatorTool = lazy(() => import('./components/tools/text/ReadingTimeCalculatorTool').then(m => ({ default: m.ReadingTimeCalculatorTool })));
const RemoveDuplicateLinesTool = lazy(() => import('./components/tools/text/RemoveDuplicateLinesTool').then(m => ({ default: m.RemoveDuplicateLinesTool })));
const RemoveEmptyLinesTool = lazy(() => import('./components/tools/text/RemoveEmptyLinesTool').then(m => ({ default: m.RemoveEmptyLinesTool })));
const FindAndReplaceTool = lazy(() => import('./components/tools/text/FindAndReplaceTool').then(m => ({ default: m.FindAndReplaceTool })));
const TextCompareTool = lazy(() => import('./components/tools/text/TextCompareTool').then(m => ({ default: m.TextCompareTool })));
const TextCleanerTool = lazy(() => import('./components/tools/text/TextCleanerTool').then(m => ({ default: m.TextCleanerTool })));
const SortLinesTool = lazy(() => import('./components/tools/text/SortLinesTool').then(m => ({ default: m.SortLinesTool })));
const LoremIpsumGeneratorTool = lazy(() => import('./components/tools/text/LoremIpsumGeneratorTool').then(m => ({ default: m.LoremIpsumGeneratorTool })));
const MarkdownEditorTool = lazy(() => import('./components/tools/text/MarkdownEditorTool').then(m => ({ default: m.MarkdownEditorTool })));

// Developer Suite Additions
const JsonMinifierTool = lazy(() => import('./components/tools/dev/JsonMinifierTool').then(m => ({ default: m.JsonMinifierTool })));
const JsonToXmlTool = lazy(() => import('./components/tools/dev/JsonToXmlTool').then(m => ({ default: m.JsonToXmlTool })));
const XmlToJsonTool = lazy(() => import('./components/tools/dev/XmlToJsonTool').then(m => ({ default: m.XmlToJsonTool })));
const MarkdownToHtmlTool = lazy(() => import('./components/tools/text/MarkdownToHtmlTool').then(m => ({ default: m.MarkdownToHtmlTool })));
const SqlFormatterTool = lazy(() => import('./components/tools/dev/SqlFormatterTool').then(m => ({ default: m.SqlFormatterTool })));
const JwtGeneratorTool = lazy(() => import('./components/tools/dev/JwtGeneratorTool').then(m => ({ default: m.JwtGeneratorTool })));
const CronExpressionGeneratorTool = lazy(() => import('./components/tools/dev/CronExpressionGeneratorTool').then(m => ({ default: m.CronExpressionGeneratorTool })));

// New 39 Suite Additions
const HexColorGeneratorTool = lazy(() => import('./components/tools/design/HexColorGeneratorTool').then(m => ({ default: m.HexColorGeneratorTool })));
const RgbColorGeneratorTool = lazy(() => import('./components/tools/design/RgbColorGeneratorTool').then(m => ({ default: m.RgbColorGeneratorTool })));
const RandomNamePickerTool = lazy(() => import('./components/tools/design/RandomNamePickerTool').then(m => ({ default: m.RandomNamePickerTool })));
const CalorieCalculatorTool = lazy(() => import('./components/tools/health/CalorieCalculatorTool').then(m => ({ default: m.CalorieCalculatorTool })));
const BusinessNameGeneratorTool = lazy(() => import('./components/tools/business/BusinessNameGeneratorTool').then(m => ({ default: m.BusinessNameGeneratorTool })));
const BrandNameGeneratorTool = lazy(() => import('./components/tools/business/BrandNameGeneratorTool').then(m => ({ default: m.BrandNameGeneratorTool })));
const CoinFlipTool = lazy(() => import('./components/tools/design/CoinFlipTool').then(m => ({ default: m.CoinFlipTool })));
const JsonViewerTool = lazy(() => import('./components/tools/dev/JsonViewerTool').then(m => ({ default: m.JsonViewerTool })));
const NamePickerWheelTool = lazy(() => import('./components/tools/design/NamePickerWheelTool').then(m => ({ default: m.NamePickerWheelTool })));
const LoanEligibilityCalculatorTool = lazy(() => import('./components/tools/business/LoanEligibilityCalculatorTool').then(m => ({ default: m.LoanEligibilityCalculatorTool })));
const CountdownCalculatorTool = lazyWithRetry(() => import('./components/tools/design/CountdownCalculatorTool').then(m => ({ default: m.CountdownCalculatorTool })));
const StopwatchTool = lazyWithRetry(() => import('./components/tools/security/StopwatchTool').then(m => ({ default: m.StopwatchTool })));
const CountdownTimerTool = lazyWithRetry(() => import('./components/tools/security/CountdownTimerTool').then(m => ({ default: m.CountdownTimerTool })));
const OnlineClockTool = lazyWithRetry(() => import('./components/tools/design/OnlineClockTool').then(m => ({ default: m.OnlineClockTool })));
const TimeZoneConverterTool = lazyWithRetry(() => import('./components/tools/design/TimeZoneConverterTool').then(m => ({ default: m.TimeZoneConverterTool })));
const DiceRollerTool = lazy(() => import('./components/tools/design/DiceRollerTool').then(m => ({ default: m.DiceRollerTool })));
const DownPaymentCalculatorTool = lazy(() => import('./components/tools/business/DownPaymentCalculatorTool').then(m => ({ default: m.DownPaymentCalculatorTool })));
const CementCalculatorTool = lazy(() => import('./components/tools/design/CementCalculatorTool').then(m => ({ default: m.CementCalculatorTool })));
const WavelengthCalculatorTool = lazy(() => import('./components/tools/design/WavelengthCalculatorTool').then(m => ({ default: m.WavelengthCalculatorTool })));
const UserAgentParserTool = lazy(() => import('./components/tools/dev/UserAgentParserTool').then(m => ({ default: m.UserAgentParserTool })));
const ModeCalculatorTool = lazy(() => import('./components/tools/design/ModeCalculatorTool').then(m => ({ default: m.ModeCalculatorTool })));
const InductanceCalculatorTool = lazy(() => import('./components/tools/design/InductanceCalculatorTool').then(m => ({ default: m.InductanceCalculatorTool })));
const RandomLetterGeneratorTool = lazy(() => import('./components/tools/design/RandomLetterGeneratorTool').then(m => ({ default: m.RandomLetterGeneratorTool })));
const WaterIntakeCalculatorTool = lazy(() => import('./components/tools/health/WaterIntakeCalculatorTool').then(m => ({ default: m.WaterIntakeCalculatorTool })));
const JsonToYamlTool = lazy(() => import('./components/tools/dev/JsonToYamlTool').then(m => ({ default: m.JsonToYamlTool })));
const UrlExtractorTool = lazy(() => import('./components/tools/text/UrlExtractorTool').then(m => ({ default: m.UrlExtractorTool })));
const BondYieldCalculatorTool = lazy(() => import('./components/tools/business/BondYieldCalculatorTool').then(m => ({ default: m.BondYieldCalculatorTool })));
const CatAgeCalculatorTool = lazy(() => import('./components/tools/design/CatAgeCalculatorTool').then(m => ({ default: m.CatAgeCalculatorTool })));
const ExamScoreCalculatorTool = lazy(() => import('./components/tools/career/ExamScoreCalculatorTool').then(m => ({ default: m.ExamScoreCalculatorTool })));
const CgpaCalculatorTool = lazy(() => import('./components/tools/career/CgpaCalculatorTool').then(m => ({ default: m.CgpaCalculatorTool })));
const MileageCalculatorTool = lazy(() => import('./components/tools/business/MileageCalculatorTool').then(m => ({ default: m.MileageCalculatorTool })));
const PaintCostCalculatorTool = lazy(() => import('./components/tools/design/PaintCostCalculatorTool').then(m => ({ default: m.PaintCostCalculatorTool })));
const DensityCalculatorTool = lazy(() => import('./components/tools/design/DensityCalculatorTool').then(m => ({ default: m.DensityCalculatorTool })));
const ScreenSizeCalculatorTool = lazy(() => import('./components/tools/design/ScreenSizeCalculatorTool').then(m => ({ default: m.ScreenSizeCalculatorTool })));
const TorqueCalculatorTool = lazy(() => import('./components/tools/design/TorqueCalculatorTool').then(m => ({ default: m.TorqueCalculatorTool })));
const LinearRegressionCalculatorTool = lazy(() => import('./components/tools/design/LinearRegressionCalculatorTool').then(m => ({ default: m.LinearRegressionCalculatorTool })));
const Sha256HashGeneratorTool = lazy(() => import('./components/tools/dev/Sha256HashGeneratorTool').then(m => ({ default: m.Sha256HashGeneratorTool })));
const UsIncomeTaxCalculatorTool = lazy(() => import('./components/tools/business/UsIncomeTaxCalculatorTool').then(m => ({ default: m.UsIncomeTaxCalculatorTool })));
const PersonalLoanCalculatorTool = lazy(() => import('./components/tools/business/PersonalLoanCalculatorTool').then(m => ({ default: m.PersonalLoanCalculatorTool })));
const SalePriceCalculatorTool = lazy(() => import('./components/tools/business/SalePriceCalculatorTool').then(m => ({ default: m.SalePriceCalculatorTool })));
const Md5HashGeneratorTool = lazy(() => import('./components/tools/dev/Md5HashGeneratorTool').then(m => ({ default: m.Md5HashGeneratorTool })));
const WideTextGeneratorTool = lazy(() => import('./components/tools/text/WideTextGeneratorTool').then(m => ({ default: m.WideTextGeneratorTool })));

// Global Utility Suite Additions
const TypingSpeedTestTool = lazyWithRetry(() => import('./components/tools/typing/TypingSpeedTestTool').then(m => ({ default: m.TypingSpeedTestTool })));
const TextReverserTool = lazyWithRetry(() => import('./components/tools/text/TextReverserTool').then(m => ({ default: m.TextReverserTool })));
const RemoveLineBreaksTool = lazyWithRetry(() => import('./components/tools/text/RemoveLineBreaksTool').then(m => ({ default: m.RemoveLineBreaksTool })));
const RemoveExtraSpacesTool = lazyWithRetry(() => import('./components/tools/text/RemoveExtraSpacesTool').then(m => ({ default: m.RemoveExtraSpacesTool })));
const TextRepeaterTool = lazyWithRetry(() => import('./components/tools/text/TextRepeaterTool').then(m => ({ default: m.TextRepeaterTool })));
const TextSplitterTool = lazyWithRetry(() => import('./components/tools/text/TextSplitterTool').then(m => ({ default: m.TextSplitterTool })));
const TextJoinerTool = lazyWithRetry(() => import('./components/tools/text/TextJoinerTool').then(m => ({ default: m.TextJoinerTool })));
const EmailExtractorTool = lazyWithRetry(() => import('./components/tools/text/EmailExtractorTool').then(m => ({ default: m.EmailExtractorTool })));
const KeywordExtractorTool = lazyWithRetry(() => import('./components/tools/text/KeywordExtractorTool').then(m => ({ default: m.KeywordExtractorTool })));
const HtmlEntityEncoderDecoderTool = lazyWithRetry(() => import('./components/tools/text/HtmlEntityEncoderDecoderTool').then(m => ({ default: m.HtmlEntityEncoderDecoderTool })));
const TextToBinaryTool = lazyWithRetry(() => import('./components/tools/dev/TextToBinaryTool').then(m => ({ default: m.TextToBinaryTool })));
const BinaryToTextTool = lazyWithRetry(() => import('./components/tools/dev/BinaryToTextTool').then(m => ({ default: m.BinaryToTextTool })));
const TextToHexTool = lazyWithRetry(() => import('./components/tools/dev/TextToHexTool').then(m => ({ default: m.TextToHexTool })));
const HexToTextTool = lazyWithRetry(() => import('./components/tools/dev/HexToTextTool').then(m => ({ default: m.HexToTextTool })));
const CssMinifierTool = lazyWithRetry(() => import('./components/tools/dev/CssMinifierTool').then(m => ({ default: m.CssMinifierTool })));
const JavascriptMinifierTool = lazyWithRetry(() => import('./components/tools/dev/JavascriptMinifierTool').then(m => ({ default: m.JavascriptMinifierTool })));
const HtmlMinifierTool = lazyWithRetry(() => import('./components/tools/dev/HtmlMinifierTool').then(m => ({ default: m.HtmlMinifierTool })));
const SqlMinifierTool = lazyWithRetry(() => import('./components/tools/dev/SqlMinifierTool').then(m => ({ default: m.SqlMinifierTool })));
const MetaTagGeneratorTool = lazyWithRetry(() => import('./components/tools/seo/MetaTagGeneratorTool').then(m => ({ default: m.MetaTagGeneratorTool })));
const RobotsTxtGeneratorTool = lazyWithRetry(() => import('./components/tools/seo/RobotsTxtGeneratorTool').then(m => ({ default: m.RobotsTxtGeneratorTool })));
const XmlSitemapGeneratorTool = lazyWithRetry(() => import('./components/tools/seo/XmlSitemapGeneratorTool').then(m => ({ default: m.XmlSitemapGeneratorTool })));
const SchemaMarkupGeneratorTool = lazyWithRetry(() => import('./components/tools/seo/SchemaMarkupGeneratorTool').then(m => ({ default: m.SchemaMarkupGeneratorTool })));
const UtmBuilderTool = lazyWithRetry(() => import('./components/tools/seo/UtmBuilderTool').then(m => ({ default: m.UtmBuilderTool })));
const ScientificCalculatorTool = lazyWithRetry(() => import('./components/tools/calculator/ScientificCalculatorTool').then(m => ({ default: m.ScientificCalculatorTool })));

const HandwritingToTextTool = lazyWithRetry(() => import('./components/tools/image/HandwritingToTextTool').then(m => ({ default: m.HandwritingToTextTool })));
const ImageToTextTool = lazyWithRetry(() => import('./components/tools/image/ImageToTextTool').then(m => ({ default: m.ImageToTextTool })));
const BarcodeScannerTool = lazyWithRetry(() => import('./components/tools/security/BarcodeScannerTool').then(m => ({ default: m.BarcodeScannerTool })));
const CalendarNotesTool = lazyWithRetry(() => import('./components/tools/security/CalendarNotesTool').then(m => ({ default: m.CalendarNotesTool })));
const ClipboardHistoryTool = lazyWithRetry(() => import('./components/tools/security/ClipboardHistoryTool').then(m => ({ default: m.ClipboardHistoryTool })));
const DailyPlannerTool = lazyWithRetry(() => import('./components/tools/security/DailyPlannerTool').then(m => ({ default: m.DailyPlannerTool })));
const ExpenseTrackerTool = lazyWithRetry(() => import('./components/tools/security/ExpenseTrackerTool').then(m => ({ default: m.ExpenseTrackerTool })));
const FileChecksumVerifierTool = lazyWithRetry(() => import('./components/tools/security/FileChecksumVerifierTool').then(m => ({ default: m.FileChecksumVerifierTool })));
const HabitTrackerTool = lazyWithRetry(() => import('./components/tools/security/HabitTrackerTool').then(m => ({ default: m.HabitTrackerTool })));
const MonthlyBudgetPlannerTool = lazyWithRetry(() => import('./components/tools/security/MonthlyBudgetPlannerTool').then(m => ({ default: m.MonthlyBudgetPlannerTool })));
const PassphraseGeneratorTool = lazyWithRetry(() => import('./components/tools/security/PassphraseGeneratorTool').then(m => ({ default: m.PassphraseGeneratorTool })));
const PasswordStrengthCheckerTool = lazyWithRetry(() => import('./components/tools/security/PasswordStrengthCheckerTool').then(m => ({ default: m.PasswordStrengthCheckerTool })));
const PomodoroTimerTool = lazyWithRetry(() => import('./components/tools/security/PomodoroTimerTool').then(m => ({ default: m.PomodoroTimerTool })));
const SecureNotesTool = lazyWithRetry(() => import('./components/tools/security/SecureNotesTool').then(m => ({ default: m.SecureNotesTool })));
const ShaChecksumGeneratorTool = lazyWithRetry(() => import('./components/tools/security/ShaChecksumGeneratorTool').then(m => ({ default: m.ShaChecksumGeneratorTool })));
const TextEncryptDecryptTool = lazyWithRetry(() => import('./components/tools/security/TextEncryptDecryptTool').then(m => ({ default: m.TextEncryptDecryptTool })));
const TodoListTool = lazyWithRetry(() => import('./components/tools/security/TodoListTool').then(m => ({ default: m.TodoListTool })));
const WeeklyPlannerTool = lazyWithRetry(() => import('./components/tools/security/WeeklyPlannerTool').then(m => ({ default: m.WeeklyPlannerTool })));
const RandomTextGeneratorTool = lazyWithRetry(() => import('./components/tools/text/RandomTextGeneratorTool').then(m => ({ default: m.RandomTextGeneratorTool })));
const SubtitleGeneratorTool = lazyWithRetry(() => import('./components/tools/video/SubtitleGeneratorTool').then(m => ({ default: m.SubtitleGeneratorTool })));
const VideoAspectRatioTool = lazyWithRetry(() => import('./components/tools/video/VideoAspectRatioTool').then(m => ({ default: m.VideoAspectRatioTool })));
const VideoCompressorTool = lazyWithRetry(() => import('./components/tools/video/VideoCompressorTool').then(m => ({ default: m.VideoCompressorTool })));
const VideoToAudioTool = lazyWithRetry(() => import('./components/tools/video/VideoToAudioTool').then(m => ({ default: m.VideoToAudioTool })));
const VideoToGifTool = lazyWithRetry(() => import('./components/tools/video/VideoToGifTool').then(m => ({ default: m.VideoToGifTool })));
const VideoTrimmerTool = lazyWithRetry(() => import('./components/tools/video/VideoTrimmerTool').then(m => ({ default: m.VideoTrimmerTool })));

// Lazy loaded legal & informational pages
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('./components/pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SeoDiagnosticsPage = lazy(() => import('./components/pages/SeoDiagnosticsPage').then(m => ({ default: m.SeoDiagnosticsPage })));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ToolSEOContent = lazy(() => import('./components/ToolSEOContent').then(m => ({ default: m.ToolSEOContent })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center min-h-[300px]">
    <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading module...</p>
  </div>
);

import { TOOLS_DATA, HOMEPAGE_FAQS, getTranslatedTools, getTranslatedFaqs } from './data/toolsData';
import { getToolSeoTitle } from './lib/seoTitles';
import { getCategoryBySlug } from './data/categoriesData';
import { detectBrowserLanguage, LanguageCode, getTranslation } from './lib/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { normalizePath, getLinkUrl } from './lib/paths';
import { ArrowRight, ChevronDown, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { HomepageHero } from './components/HomepageHero';

export default function App() {
  // Path routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('p');
      if (redirectParam) {
        const cleanPath = '/' + redirectParam.replace(/^\//, '');
        const fullUrl = getLinkUrl(cleanPath);
        window.history.replaceState({}, '', fullUrl);
        return normalizePath(cleanPath);
      }
    } catch {
      // Ignore URL parsing fallback
    }

    return normalizePath(window.location.pathname);
  });

  // Language state
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-lang');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return detectBrowserLanguage();
  });

  // Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('zubware-theme') || localStorage.getItem('splitdrop-theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Homepage category filter
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('All');

  const translatedTools = useMemo(() => getTranslatedTools(currentLang), [currentLang]);
  const translatedFaqs = useMemo(() => getTranslatedFaqs(currentLang), [currentLang]);

  // Find tool metadata for current page
  const cleanCurrentPath = currentPath.replace(/\/$/, '');
  const pathSegment = cleanCurrentPath.split('/').pop() || '';
  const activeTool = useMemo(() => {
    // 1. Direct match on tool path or exact root-prefixed filename
    const directMatch = translatedTools.find((t) => {
      if (t.path === currentPath || t.path === cleanCurrentPath) return true;
      if (('/' + t.filename) === currentPath || ('/' + t.filename) === cleanCurrentPath) return true;
      return false;
    });
    if (directMatch) return directMatch;

    // 2. Exact segment match on filename or tool ID (prevents substring suffix collisions)
    const segmentMatch = translatedTools.find((t) => {
      if (t.filename !== 'index.html' && (pathSegment === t.filename || pathSegment === t.id)) return true;
      return false;
    });
    if (segmentMatch) return segmentMatch;

    // 3. Backward compatibility aliases for stopwatch, timezone converter and splitdrop
    return translatedTools.find((t) => {
      if (t.id === 'online-stopwatch' && (pathSegment === 'stopwatch.html' || pathSegment === 'stopwatch')) return true;
      if (t.id === 'time-zone-converter' && (pathSegment === 'timezone-converter.html' || pathSegment === 'timezone-converter')) return true;
      if (t.id === 'splitdrop' && (pathSegment === 'image-splitter-merger.html' || pathSegment === 'splitdrop' || pathSegment === 'splitdrop.html')) return true;
      if (t.id === 'youtube-thumbnail-simulator' && (pathSegment.includes('thumbnail-simulator') || pathSegment.includes('youtube-thumbnail-feed-simulator'))) return true;
      if (t.id === 'youtube-banner-safe-area' && (pathSegment.includes('banner-safe-area') || pathSegment.includes('youtube-banner'))) return true;
      if (t.id === 'matching-parts-video-maker' && pathSegment.includes('matching-parts')) return true;
      return false;
    });
  }, [translatedTools, currentPath, cleanCurrentPath, pathSegment]);

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+D, Ctrl+/, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (activeTool) {
          const added = toggleFavorite(activeTool.id);
          triggerToast(added ? 'Added tool to favorites! ⭐' : 'Removed from favorites');
        } else {
          triggerToast('Open a tool to bookmark it to favorites!');
        }
      } else if (isCmdOrCtrl && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool?.id]);

  // Apply dark mode class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('zubware-theme', 'dark');
        localStorage.setItem('splitdrop-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('zubware-theme', 'light');
        localStorage.setItem('splitdrop-theme', 'light');
      }
    } catch {
      // Storage restricted
    }
  }, [darkMode]);

  // Apply RTL direction for Arabic & Urdu
  useEffect(() => {
    try {
      localStorage.setItem('splitdrop-lang', currentLang);
      if (currentLang === 'ar' || currentLang === 'ur') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch {
      // ignore
    }
  }, [currentLang]);

  // Handle popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname + window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string) => {
    const norm = normalizePath(path);
    const fullUrl = getLinkUrl(norm);
    try {
      window.history.pushState({}, '', fullUrl);
    } catch {
      // Safe fallback for sandboxed iframes
    }
    setCurrentPath(norm);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Safe fallback
    }
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  }, []);

  // Static Legal/Info Page checks
  const isPrivacyPage = currentPath.includes('privacy');
  const isTermsPage = currentPath.includes('terms');
  const isDisclaimerPage = currentPath.includes('disclaimer');
  const isContactPage = currentPath.includes('contact');
  const isAboutPage = currentPath.includes('about');
  const isDiagnosticsPage = currentPath.includes('seo-diagnostics') || currentPath.includes('diagnostics');

  // Platform Feature Page checks
  const isDashboardPage = currentPath.includes('dashboard');
  const isCategoryPage = currentPath.includes('category') || currentPath.includes('categories');
  const isHelpPage = currentPath.includes('help');
  const isChangelogPage = currentPath.includes('changelog');
  const isFeedbackPage = currentPath.includes('feedback');

  const isPlatformPage = isDashboardPage || isCategoryPage || isHelpPage || isChangelogPage || isFeedbackPage;
  const isStaticPage = isPrivacyPage || isTermsPage || isDisclaimerPage || isContactPage || isAboutPage || isPlatformPage || isDiagnosticsPage;

  // Extract active category slug from current URL/path
  const getCategorySlugFromPath = (path: string): string | undefined => {
    try {
      const qIndex = path.indexOf('?');
      if (qIndex !== -1) {
        const searchParams = new URLSearchParams(path.substring(qIndex));
        const cat = searchParams.get('cat');
        if (cat) return cat;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const cat = searchParams.get('cat');
      if (cat) return cat;
    } catch {
      // ignore
    }
    return undefined;
  };

  const activeCategorySlug = isCategoryPage ? getCategorySlugFromPath(currentPath) || 'all' : undefined;
  const activeCategoryItem = activeCategorySlug ? getCategoryBySlug(activeCategorySlug) : undefined;

  // Dynamic breadcrumb generator
  const buildBreadcrumbItems = () => {
    const homeItem = { label: getTranslation(currentLang, 'home', 'Home'), path: getLinkUrl('/') };

    if (isDashboardPage) {
      return [homeItem, { label: getTranslation(currentLang, 'userDashboard', 'User Dashboard') }];
    }

    if (isCategoryPage) {
      const catListItem = { label: getTranslation(currentLang, 'toolCategories', 'Tool Categories'), path: getLinkUrl('/categories.html') };
      if (activeCategorySlug && activeCategorySlug !== 'all' && activeCategoryItem) {
        const translatedCatName = getTranslation(currentLang, activeCategoryItem.nameKey, activeCategoryItem.defaultName);
        return [homeItem, catListItem, { label: translatedCatName }];
      }
      return [homeItem, { label: getTranslation(currentLang, 'toolCategories', 'Tool Categories') }];
    }

    if (isHelpPage) return [homeItem, { label: getTranslation(currentLang, 'help', 'Help Center') }];
    if (isChangelogPage) return [homeItem, { label: getTranslation(currentLang, 'changelog', 'Changelog') }];
    if (isFeedbackPage) return [homeItem, { label: getTranslation(currentLang, 'feedback', 'Feedback') }];
    if (isPrivacyPage) return [homeItem, { label: getTranslation(currentLang, 'privacy', 'Privacy Policy') }];
    if (isTermsPage) return [homeItem, { label: getTranslation(currentLang, 'terms', 'Terms') }];
    if (isDisclaimerPage) return [homeItem, { label: getTranslation(currentLang, 'disclaimer', 'Disclaimer') }];
    if (isContactPage) return [homeItem, { label: getTranslation(currentLang, 'contact', 'Contact') }];
    if (isAboutPage) return [homeItem, { label: getTranslation(currentLang, 'about', 'About') }];

    return [homeItem];
  };

  return (
    <LanguageProvider currentLang={currentLang} onChangeLang={setCurrentLang}>
      <AccessibilityWrapper activeModalOpen={searchOpen || shortcutsOpen}>
        <div className="relative min-h-screen flex flex-col font-sans bg-slate-100/90 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-indigo-600 selection:text-white overflow-x-hidden">
        
        {/* Skip to Main Content Link for WCAG Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:text-xs outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Skip to main content
        </a>

        {/* Subtle Ambient Background Glass Glowing Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-3xl animate-glass-orb-1" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-purple-500/15 dark:bg-purple-600/15 blur-3xl animate-glass-orb-2" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl animate-glass-orb-1" />
        </div>

        {/* Glass Toast Banner */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 40, scale: 0.9, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: 20, scale: 0.95, x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed bottom-6 left-1/2 z-50 px-5 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm shadow-2xl shadow-indigo-500/20 flex items-center gap-2"
            >
              <span className="text-emerald-500 font-black" aria-hidden="true">✓</span> {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Header Container */}
        <div className="sticky top-0 z-50 w-full">
          <Header
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenSearch={() => setSearchOpen(true)}
            currentPath={currentPath}
            onNavigate={navigateTo}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
          />
        </div>

        {/* Main Page Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8 outline-none">
          
          {/* ========================================================
              STATIC INFORMATIONAL / LEGAL PAGES
              ======================================================== */}
          {isStaticPage && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Sticky Navigation Bar with Back Button & Breadcrumbs */}
              <div className="sticky top-28 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-4">
                <BackButton onNavigate={navigateTo} />
                <Breadcrumb
                  items={buildBreadcrumbItems()}
                  onNavigate={navigateTo}
                />
              </div>

              <Suspense fallback={<LoadingFallback />}>
                {isDashboardPage && <DashboardPage onNavigate={navigateTo} onShowToast={triggerToast} />}
                {isCategoryPage && <CategoryPage categorySlug={activeCategorySlug} onNavigate={navigateTo} onShowToast={triggerToast} />}
                {isHelpPage && <HelpPage onNavigate={navigateTo} />}
                {isChangelogPage && <ChangelogPage />}
                {isFeedbackPage && <FeedbackPage onShowToast={triggerToast} />}
                {isPrivacyPage && <PrivacyPolicyPage onNavigate={navigateTo} />}
                {isTermsPage && <TermsPage onNavigate={navigateTo} />}
                {isDisclaimerPage && <DisclaimerPage onNavigate={navigateTo} />}
                {isContactPage && <ContactPage onShowToast={triggerToast} />}
                {isAboutPage && <AboutPage onNavigate={navigateTo} />}
                {isDiagnosticsPage && <SeoDiagnosticsPage onNavigate={navigateTo} />}
              </Suspense>
            </div>
          )}

          {/* ========================================================
              404 NOT FOUND VIEW
              ======================================================== */}
          {!isStaticPage && !activeTool && currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '' && (
            <Suspense fallback={<LoadingFallback />}>
              <NotFoundPage onNavigate={navigateTo} />
            </Suspense>
          )}

          {/* ========================================================
              HOMEPAGE VIEW
              ======================================================== */}
          {!isStaticPage && !activeTool && (currentPath === '/' || currentPath === '/index.html' || currentPath === '') && (
            <>
              <SEOHead
                title="Zubware — Free Online Multi-Tool Suite"
                description="Explore 300+ free online tools for PDF, images, video, developers, calculators, and productivity. 100% private, instant browser processing with zero server uploads."
                canonicalPath="/"
                faqs={HOMEPAGE_FAQS}
              />

              {/* Website Intro & Bada Sa Search Bar */}
              <HomepageHero
                tools={translatedTools}
                onNavigate={navigateTo}
                selectedCategory={homeCategoryFilter}
                onSelectCategory={setHomeCategoryFilter}
              />

              {/* AD PLACEMENT 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* EXPLORE FREE TOOLS SECTION */}
              <section className="my-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      {getTranslation(currentLang, 'freeTools', 'Free Multi-Tool Suite')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {homeCategoryFilter === 'All'
                        ? getTranslation(currentLang, 'exploreAllTools', 'Explore Free Online Tools')
                        : homeCategoryFilter}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-0 font-medium">
                    {getTranslation(currentLang, 'fastBrowserBased', 'Fast, browser-based, zero installation required')}
                  </p>
                </div>

                {/* Grouped Category Grids */}
                <div className="space-y-12">
                  {Array.from(new Set(translatedTools.map(t => t.category)))
                    .filter(catName => homeCategoryFilter === 'All' || homeCategoryFilter === catName)
                    .map((catName) => {
                      const categoryTools = translatedTools.filter(t => t.category === catName);
                      if (!categoryTools.length) return null;
                    return (
                      <div key={catName} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {catName}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
                            {categoryTools.length} Tools
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryTools.map((tool) => (
                            <motion.div
                              key={tool.id}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                              onClick={() => navigateTo(getLinkUrl(tool.path))}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform">
                                    {tool.icon}
                                  </span>
                                  {tool.badge && (
                                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {tool.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                  {tool.description}
                                </p>

                                <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  {tool.features.slice(0, 3).map((f, i) => (
                                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                      <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateTo(getLinkUrl(tool.path));
                                  }}
                                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20"
                                >
                                  <span>{getTranslation(currentLang, 'openTool', 'Open')} {tool.navTitle}</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AD PLACEMENT 2 */}
              <AdSlot type="native" label="Sponsored Content" />

              {/* FEATURES SECTION */}
              <section className="glass-panel my-12 p-8 sm:p-12 rounded-3xl text-slate-900 dark:text-white">
                <div className="max-w-3xl">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {getTranslation(currentLang, 'builtForSpeedAndPrivacy', 'Built for Speed & Privacy')}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
                    {getTranslation(currentLang, 'whyCreatorsChoose', 'Why Creators & Professionals Choose Zubware')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    Traditional web tools upload your private pictures and PDFs to distant cloud servers. Zubware runs 100% inside your local browser using modern HTML5 Canvas, PDF-lib, and Web Assembly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                  <div className="glass-card p-5 rounded-2xl">
                    <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'zeroServerUploads', 'Zero Server Uploads')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'zeroServerUploadsDesc', 'Your confidential files never leave your device memory. Total security.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Zap className="w-7 h-7 text-amber-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'instantSpeed', 'Sub-Second Processing')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'instantSpeedDesc', 'No upload wait times or server queue bottlenecks. Instant results.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Sparkles className="w-7 h-7 text-emerald-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'freeForever', 'Free Forever')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'freeForeverDesc', 'No watermarks, daily submission limits, or required accounts.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* HOMEPAGE FAQ SECTION */}
              <section className="my-12 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {getTranslation(currentLang, 'faqsTitle', 'Frequently Asked Questions')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {getTranslation(currentLang, 'faqSubtitle', 'Everything you need to know about Zubware and our free online tools.')}
                  </p>
                </div>

                <div className="space-y-3">
                  {translatedFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="glass-card rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AD PLACEMENT 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </>
          )}

          {/* ========================================================
              DEDICATED TOOL PAGES
              ======================================================== */}
          {!isStaticPage && activeTool && (() => {
            const cleanCategoryName = activeTool.category.replace(/^[^\w]+/, '').trim();
            const toolBreadcrumbList = [
              { label: 'Home', path: getLinkUrl('/') },
              { label: cleanCategoryName, path: getLinkUrl('/categories.html') },
              { label: activeTool.navTitle }
            ];

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

            const toolHowToSchema = {
              name: `How to Use ${activeTool.navTitle}`,
              description: activeTool.description,
              steps: isFileTool
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
              <div className="max-w-5xl mx-auto space-y-6">
                <SEOHead
                  title={getToolSeoTitle(activeTool)}
                  description={activeTool.description}
                  canonicalPath={activeTool.path}
                  toolMeta={activeTool}
                  faqs={activeTool.faq}
                  breadcrumbs={toolBreadcrumbList}
                  howTo={toolHowToSchema}
                />

                {/* Sticky Navigation Bar with Professional Back Button & Breadcrumbs */}
                <div className="sticky top-16 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-2">
                  <BackButton onNavigate={navigateTo} />
                  <Breadcrumb
                    items={toolBreadcrumbList}
                    onNavigate={navigateTo}
                  />
                </div>

                {/* Tool Title Banner */}
                <div className="text-center max-w-2xl mx-auto mb-4">
                  <span className="text-4xl mb-2 inline-block">{activeTool.icon}</span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {activeTool.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {activeTool.description}
                  </p>
                </div>

              {/* TOOL PAGE AD 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* THE TOOL COMPONENT INTERFACE WRAPPED IN FROSTED GLASS */}
              <div className="glass-panel rounded-3xl overflow-hidden">
                <ToolErrorBoundary toolTitle={activeTool.title} onReset={() => window.location.reload()}>
                  <Suspense fallback={<LoadingFallback />}>
                    {activeTool.id === 'splitdrop' && <SplitDropHero onShowToast={triggerToast} />}
                    {activeTool.id === 'background-remover' && <BackgroundRemoverTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-compressor' && <ImageCompressorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-converter' && <ImageConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-resizer' && <ImageResizerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'crop-image' && <CropImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'rotate-image' && <RotateImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'flip-image' && <FlipImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-watermark' && <WatermarkImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'blur-image' && <BlurImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'pixelate-image' && <PixelateImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'exif-remover' && <ExifRemoverTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-color-picker' && <ColorPickerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-info-viewer' && <ImageInfoViewerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'background-color-changer' && <BackgroundColorChangerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'rounded-corners' && <RoundedCornerGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-border' && <ImageBorderGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-frame' && <ImageFrameGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-collage' && <ImageCollageMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'favicon-generator' && <FaviconGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'svg-optimizer' && <SvgOptimizerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'gif-maker' && <GifMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'batch-image-converter' && <BatchImageConverterTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'compression-comparison' && <ImageCompressionComparisonTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'heic-to-jpg' && <HeicToJpgTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'bulk-image-renamer-resizer' && <BulkImageRenamerResizerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'passport-photo-maker' && <PassportPhotoMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'matching-parts-video-maker' && <MatchingPartsPuzzleVideoMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'lofi-song-maker' && <LofiMusicStudioTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'lofi-maker' && <LofiMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'slowed-and-reverb' && <SlowedAndReverbTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'gst-invoice-generator' && <GstInvoiceGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'pdf-merge' && <PdfMergeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-split' && <PdfSplitTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-to-pdf' && <ImageToPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-images' && <PdfToImagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'rotate-pdf' && <RotatePdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'delete-pdf-pages' && <DeletePdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'extract-pdf-pages' && <ExtractPdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'reorder-pdf-pages' && <ReorderPdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-watermark' && <PdfWatermarkTool onShowToast={triggerToast} />}
                  {activeTool.id === 'protect-pdf' && <ProtectPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unlock-pdf' && <UnlockPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-metadata' && <PdfMetadataTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-generator' && <QrGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-builder' && <ResumeBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'ats-resume-checker' && <AtsResumeCheckerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-score-analyzer' && <ResumeScoreAnalyzerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cover-letter-builder' && <CoverLetterBuilderTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cover-letter-templates' && <CoverLetterTemplatesTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cv-builder' && <CvBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-keyword-optimizer' && <ResumeKeywordOptimizerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-template-gallery' && <ResumeTemplateGalleryTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-version-manager' && <ResumeVersionManagerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-import' && <ResumeImportTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-export' && <ResumeExportTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-completeness' && <ResumeCompletenessTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-section-manager' && <ResumeSectionManagerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'professional-skill-library' && <ProfessionalSkillLibraryTool onShowToast={triggerToast} />}
                  {activeTool.id === 'summary-generator' && <SummaryGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-color-themes' && <ResumeColorThemesTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'experience-calculator' && <ExperienceCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'notice-period-calculator' && <NoticePeriodCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'salary-hike-calculator' && <SalaryHikeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'ctc-calculator' && <CtcCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'working-days-calculator' && <WorkingDaysCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-title-generator' && <YouTubeTitleGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-description-generator' && <YouTubeDescriptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-tags-generator' && <YouTubeTagsGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-hashtag-generator' && <YouTubeHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-thumbnail-simulator' && <YouTubeThumbnailSimulatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-banner-safe-area' && <YouTubeBannerSafeAreaTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-thumbnail-preview' && <YouTubeThumbnailPreviewTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-channel-name-generator' && <YouTubeChannelNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-video-idea-generator' && <YouTubeVideoIdeaGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-playlist-name-generator' && <YouTubePlaylistNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-timestamp-generator' && <YouTubeTimestampGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-description-formatter' && <YouTubeDescriptionFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'thumbnail-text-generator' && <ThumbnailTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'viral-hook-generator' && <ViralHookGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cta-generator' && <CtaGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-character-counter' && <SocialCharacterCounterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emoji-generator' && <EmojiGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-caption-generator' && <InstagramCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-hashtag-generator' && <InstagramHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-bio-generator' && <InstagramBioGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-username-generator' && <InstagramUsernameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tiktok-caption-generator' && <TikTokCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tiktok-hashtag-generator' && <TikTokHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'facebook-caption-generator' && <FacebookCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'facebook-hashtag-generator' && <FacebookHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'linkedin-headline-generator' && <LinkedInHeadlineGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'linkedin-summary-generator' && <LinkedInSummaryGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'twitter-bio-generator' && <TwitterBioGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'universal-hashtag-generator' && <UniversalHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'fancy-text-generator' && <FancyTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unicode-font-generator' && <UnicodeFontGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-decorator' && <TextDecoratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emoji-combiner' && <EmojiCombinerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-media-post-formatter' && <SocialMediaPostFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-bio-link-builder' && <SocialBioLinkBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'islamic-shorts-maker' && <IslamicShortsMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'script-to-video-maker' && <ScriptToVideoMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'uuid-generator' && <UuidGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'hash-generator' && <HashGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'jwt-decoder' && <JwtDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unix-timestamp-converter' && <UnixTimestampConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'regex-tester' && <RegexTesterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-formatter' && <JsonFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-validator' && <JsonValidatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-to-csv' && <JsonToCsvTool onShowToast={triggerToast} />}
                  {activeTool.id === 'csv-to-json' && <CsvToJsonTool onShowToast={triggerToast} />}
                  {activeTool.id === 'csv-viewer' && <CsvViewerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'website-downloader' && <WebsiteDownloaderTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'html-formatter' && <HtmlFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-formatter' && <CssFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'javascript-formatter' && <JsFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-formatter' && <XmlFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-validator' && <XmlValidatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'url-parser' && <UrlParserTool onShowToast={triggerToast} />}
                  {activeTool.id === 'url-encoder-decoder' && <UrlEncoderDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'base64-encoder-decoder' && <Base64EncoderDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'html-escape-unescape' && <HtmlEscapeUnescapeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'http-header-viewer' && <HttpHeaderViewerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'api-request-builder' && <ApiRequestBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'color-converter' && <ColorConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-code-decoder' && <QrCodeDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-gradient-generator' && <CssGradientGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'box-shadow-generator' && <BoxShadowGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'border-radius-generator' && <BorderRadiusGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'glassmorphism-generator' && <GlassmorphismGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'neumorphism-generator' && <NeumorphismGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-clip-path-generator' && <CssClipPathGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'svg-shape-generator' && <SvgShapeGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'color-palette-generator' && <ColorPaletteGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'contrast-checker' && <ContrastCheckerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-color-generator' && <RandomColorGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-business-card-generator' && <QrBusinessCardGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unit-converter' && <UnitConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'percentage-calculator' && <PercentageCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'age-calculator' && <AgeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emi-calculator' && <EmiCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'discount-calculator' && <DiscountCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'currency-calculator' && <CurrencyCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tip-calculator' && <TipCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-number-generator' && <RandomNumberGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-password-generator' && <RandomPasswordGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'number-to-words' && <NumberToWordsTool onShowToast={triggerToast} />}
                  {activeTool.id === 'words-to-number' && <WordsToNumberTool onShowToast={triggerToast} />}
                  {activeTool.id === 'roman-numeral-converter' && <RomanNumeralConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'loan-calculator' && <LoanMortgageCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'roi-calculator' && <RoiProfitMarginCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'compound-interest-calculator' && <CompoundInterestCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'learning-licence-mock-test' && <LearningLicenceMockTest onShowToast={triggerToast} />}
                  {activeTool.id === 'chatgpt-prompt-builder' && <ChatgptPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'gemini-prompt-builder' && <GeminiPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'claude-prompt-builder' && <ClaudePromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'veo-prompt-builder' && <VeoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'midjourney-prompt-builder' && <MidjourneyPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'flux-prompt-builder' && <FluxPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'stable-diffusion-prompt-builder' && <StableDiffusionPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'logo-prompt-builder' && <LogoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'thumbnail-prompt-builder' && <ThumbnailPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'product-photo-prompt-builder' && <ProductPhotoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'interior-design-prompt-builder' && <InteriorDesignPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'story-prompt-builder' && <StoryPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-script-prompt-builder' && <YoutubeScriptPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-prompt-builder' && <ResumePromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cover-letter-prompt-builder' && <CoverLetterPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'email-prompt-builder' && <EmailPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-media-prompt-builder' && <SocialMediaPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'seo-prompt-builder' && <SeoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'coding-prompt-builder' && <CodingPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'universal-prompt-builder' && <UniversalPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-code-safety-checker' && <QrCodeSafetyCheckerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'weight-gain-calculator' && <WeightGainCalculatorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'pdf-size-adjuster' && <PdfSizeAdjusterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'increase-pdf-size' && <IncreasePdfSizeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'decrease-pdf-size' && <DecreasePdfSizeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-compressor' && <DecreasePdfSizeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-jpg' && <PdfToJpgTool onShowToast={triggerToast} />}
                  {activeTool.id === 'edit-pdf' && <EditPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-to-pdf' && <TextToPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'signature-maker' && <SignatureMakerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'signature-resizer' && <SignatureResizerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'photo-signature-joiner' && <PhotoSignatureJoinerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'photo-name-date-joiner' && <PhotoNameDateJoinerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-to-handwriting' && <TextToHandwritingTool onShowToast={triggerToast} />}
                  {activeTool.id === 'omr-sheet-generator' && <OmrSheetGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'barcode-generator' && <BarcodeGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-word' && <PdfToWordTool onShowToast={triggerToast} />}
                  {activeTool.id === 'word-to-pdf' && <WordToPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-text' && <PdfToTextTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-excel' && <PdfToExcelTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-page-number' && <PdfPageNumberTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-compare' && <PdfCompareTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-signature' && <PdfSignatureTool onShowToast={triggerToast} />}
                  {activeTool.id === 'case-converter' && <CaseConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'word-counter' && <WordCounterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'character-counter' && <CharacterCounterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'reading-time-calculator' && <ReadingTimeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'remove-duplicate-lines' && <RemoveDuplicateLinesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'remove-empty-lines' && <RemoveEmptyLinesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'find-and-replace' && <FindAndReplaceTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-compare' && <TextCompareTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-cleaner' && <TextCleanerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sort-lines' && <SortLinesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'lorem-ipsum-generator' && <LoremIpsumGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'markdown-editor' && <MarkdownEditorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-minifier' && <JsonMinifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-to-xml' && <JsonToXmlTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-to-json' && <XmlToJsonTool onShowToast={triggerToast} />}
                  {activeTool.id === 'markdown-to-html' && <MarkdownToHtmlTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sql-formatter' && <SqlFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'jwt-generator' && <JwtGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cron-expression-generator' && <CronExpressionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'hex-color-generator' && <HexColorGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'rgb-color-generator' && <RgbColorGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-name-picker' && <RandomNamePickerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'calorie-calculator' && <CalorieCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'business-name-generator' && <BusinessNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'brand-name-generator' && <BrandNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'coin-flip' && <CoinFlipTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-viewer' && <JsonViewerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'name-picker-wheel' && <NamePickerWheelTool onShowToast={triggerToast} />}
                  {activeTool.id === 'loan-eligibility-calculator' && <LoanEligibilityCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'countdown-calculator' && <CountdownCalculatorTool onShowToast={triggerToast} />}
                  {(activeTool.id === 'online-stopwatch' || (activeTool.id as string) === 'stopwatch') && <StopwatchTool onShowToast={triggerToast} />}
                  {activeTool.id === 'countdown-timer' && <CountdownTimerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'online-clock' && <OnlineClockTool onShowToast={triggerToast} />}
                  {(activeTool.id === 'time-zone-converter' || (activeTool.id as string) === 'timezone-converter') && <TimeZoneConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'dice-roller' && <DiceRollerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'down-payment-calculator' && <DownPaymentCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cement-calculator' && <CementCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'wavelength-calculator' && <WavelengthCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'user-agent-parser' && <UserAgentParserTool onShowToast={triggerToast} />}
                  {activeTool.id === 'mode-calculator' && <ModeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'inductance-calculator' && <InductanceCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-letter-generator' && <RandomLetterGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'water-intake-calculator' && <WaterIntakeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-to-yaml' && <JsonToYamlTool onShowToast={triggerToast} />}
                  {activeTool.id === 'url-extractor' && <UrlExtractorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'bond-yield-calculator' && <BondYieldCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cat-age-calculator' && <CatAgeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'exam-score-calculator' && <ExamScoreCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cgpa-calculator' && <CgpaCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'mileage-calculator' && <MileageCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'paint-cost-calculator' && <PaintCostCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'density-calculator' && <DensityCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'screen-size-calculator' && <ScreenSizeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'torque-calculator' && <TorqueCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'linear-regression-calculator' && <LinearRegressionCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sha256-hash-generator' && <Sha256HashGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'us-income-tax-calculator' && <UsIncomeTaxCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'personal-loan-calculator' && <PersonalLoanCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sale-price-calculator' && <SalePriceCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'md5-hash-generator' && <Md5HashGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'wide-text-generator' && <WideTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'typing-speed-test' && <TypingSpeedTestTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-reverser' && <TextReverserTool onShowToast={triggerToast} />}
                  {activeTool.id === 'remove-line-breaks' && <RemoveLineBreaksTool onShowToast={triggerToast} />}
                  {activeTool.id === 'remove-extra-spaces' && <RemoveExtraSpacesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-repeater' && <TextRepeaterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-splitter' && <TextSplitterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-joiner' && <TextJoinerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'email-extractor' && <EmailExtractorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'keyword-extractor' && <KeywordExtractorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'html-entity-encoder-decoder' && <HtmlEntityEncoderDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-to-binary' && <TextToBinaryTool onShowToast={triggerToast} />}
                  {activeTool.id === 'binary-to-text' && <BinaryToTextTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-to-hex' && <TextToHexTool onShowToast={triggerToast} />}
                  {activeTool.id === 'hex-to-text' && <HexToTextTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-minifier' && <CssMinifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'javascript-minifier' && <JavascriptMinifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'html-minifier' && <HtmlMinifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sql-minifier' && <SqlMinifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'meta-tag-generator' && <MetaTagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'robots-txt-generator' && <RobotsTxtGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-sitemap-generator' && <XmlSitemapGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'schema-markup-generator' && <SchemaMarkupGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'utm-builder' && <UtmBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'scientific-calculator' && <ScientificCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'handwriting-to-text' && <HandwritingToTextTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-to-text' && <ImageToTextTool onShowToast={triggerToast} />}
                  {activeTool.id === 'barcode-scanner' && <BarcodeScannerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'calendar-notes' && <CalendarNotesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'clipboard-history' && <ClipboardHistoryTool onShowToast={triggerToast} />}
                  {activeTool.id === 'daily-planner' && <DailyPlannerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'expense-tracker' && <ExpenseTrackerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'file-checksum-verifier' && <FileChecksumVerifierTool onShowToast={triggerToast} />}
                  {activeTool.id === 'habit-tracker' && <HabitTrackerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'monthly-budget-planner' && <MonthlyBudgetPlannerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'passphrase-generator' && <PassphraseGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'password-strength-checker' && <PasswordStrengthCheckerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pomodoro-timer' && <PomodoroTimerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'secure-notes' && <SecureNotesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'sha-checksum-generator' && <ShaChecksumGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-encrypt-decrypt' && <TextEncryptDecryptTool onShowToast={triggerToast} />}
                  {activeTool.id === 'todo-list' && <TodoListTool onShowToast={triggerToast} />}
                  {activeTool.id === 'weekly-planner' && <WeeklyPlannerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-text-generator' && <RandomTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'subtitle-generator' && <SubtitleGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'video-aspect-ratio' && <VideoAspectRatioTool onShowToast={triggerToast} />}
                  {activeTool.id === 'video-compressor' && <VideoCompressorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'video-to-audio' && <VideoToAudioTool onShowToast={triggerToast} />}
                  {activeTool.id === 'video-to-gif' && <VideoToGifTool onShowToast={triggerToast} />}
                  {activeTool.id === 'video-trimmer' && <VideoTrimmerTool onShowToast={triggerToast} />}
                  </Suspense>
                </ToolErrorBoundary>
              </div>

              {/* TOOL PAGE AD 2 */}
              <AdSlot type="native" label="Sponsored Links" />

              {/* INSTRUCTIONS / HOW TO USE */}
              <section className="glass-panel my-8 p-6 sm:p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {getTranslation(currentLang, 'howToUse', 'How to Use')} {activeTool.navTitle}
                </h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">1. {getTranslation(currentLang, 'uploadFiles', 'Upload Files')}</strong>
                    Drag and drop or select your files from your device.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">2. {getTranslation(currentLang, 'configureOptions', 'Configure Options')}</strong>
                    Adjust parameters like quality, ranges, or target formats.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">3. {getTranslation(currentLang, 'downloadResult', 'Download Result')}</strong>
                    Save your processed files directly to your machine or download as ZIP.
                  </li>
                </ol>
              </section>

              {/* TOOL RECOMMENDATIONS */}
              <ToolRecommendations
                currentTool={activeTool}
                allTools={translatedTools}
                onNavigate={navigateTo}
              />

              {/* RICH CRAWLABLE AEO & SEO CONTENT MODULE */}
              <Suspense fallback={<LoadingFallback />}>
                <ToolSEOContent tool={activeTool} allTools={translatedTools} onNavigate={navigateTo} />
              </Suspense>

              {/* TOOL PAGE AD 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </div>
            );
          })()}
        </main>

        {/* Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectTool={navigateTo}
        />

        {/* Keyboard Shortcuts Help Modal */}
        <KeyboardShortcutsModal
          isOpen={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
        />

        {/* Offline & PWA Install Banner */}
        <InstallBanner />

        {/* Footer */}
        <Footer onNavigate={navigateTo} />
      </div>
    </AccessibilityWrapper>
  </LanguageProvider>
  );
}
