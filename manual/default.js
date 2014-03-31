// UASR: Unified Approach to Speech Synthesis and Recognition
// - Javascript functions for manual pages
//
// AUTHOR : Matthias Wolff
// PACKAGE: uasr/manual
//
// Copyright 2013 UASR contributors (see COPYRIGHT file)
// - Chair of System Theory and Speech Technology, TU Dresden
// - Chair of Communications Engineering, BTU Cottbus
//
// This file is part of UASR.
//
// UASR is free software: you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// UASR is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
// details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with UASR. If not, see <http://www.gnu.org/licenses/>.

var TOC_TOGGLE   = 0;
var TOC_EXPAND   = 1;
var TOC_COLLAPSE = 2;

/**
 * Prints a section.
 * 
 * @param sId
 *          The section id.
 * @param sChapter
 *          The chapter name.
 * @param sRpath
 *          The path to the HTML root folder.
 */
function __PrintSection(sId,sChapter,sRpath)
{
	var iNow = new Date();
	var iWin = window.open("about:blank","_PRINT","menubar=yes,scrollbars=yes,resizable=yes");
	if (!iWin)
	{
		alert("ERROR.\n\nCannot open print preview window.\nTo use this feature, please enable popup windows.");
		return;
	}
	var sSection = "";
	try
	{
		if (!sChapter) sChapter=""; else sChapter=" - "+sChapter;
		if (sId == "cls") sId = null;
		sSection = sId ? document.getElementById(sId).innerHTML : document.getElementsByTagName("body")[0].innerHTML;
		sSection = sSection.replace(/stc_004.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_005.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_015.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_016.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_017.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_023.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_024.gif/g,"stc_000.gif");
		sSection = sSection.replace(/stc_026.gif/g,"stc_000.gif");
		with (iWin.document)
		{
			open();
			writeln("<html>");
			writeln("<head>");
			writeln("  <title>Print Preview "+sChapter+"</title>");
			writeln("  <link rel=stylesheet type=\"text/css\" href=\""+sRpath+"/print.css\">");
			writeln("</head>");
			writeln("<body>");
			writeln("<p class=\"small\">UASR Manual "+sChapter+"</p>");
			writeln(sSection);
			writeln("<p class=\"small\">Printed from the UASR manual.<br>");
			writeln("State: "+iNow.toLocaleString()+"<br>");
			writeln("Copyright: UASR contributors</p>");
			writeln("</body>");
			writeln("</html>");
			close();
		}
		iWin.print();
		// Will cause Opera to crash ... :( -->
		//iWin.setTimeout("window.close()",100);
		// <--
	}
	catch (e)
	{
		alert("ERROR.\n\nUnable to create print preview.");
		iWin.close();
	}	
}

/**
 * Initial folding of the TOC tree.
 * 
 * @param sRootNode
 *          The root node id.
 */
function __tocInit(sRootNode)
{
  var iRoot  = document.getElementById(sRootNode);
  var aiDivs = iRoot.getElementsByTagName("div");
  
  for (i=0; i<aiDivs.length; i++)
  {
	if (aiDivs[i].className!="tocNode") continue;
	if (aiDivs[i].id=="" || aiDivs[i].id=="tocPackageDocumentation") continue;
	// HACK: IE will get stuck when invoking __tocToggle directly 
	window.setTimeout("__tocToggle(\""+aiDivs[i].id+"\",TOC_COLLAPSE)",10);
  }
}

/**
 * Toggles a TOC node.
 * 
 * @param sNode
 *          The node id.
 * @param nMode
 *          <code>TOC_TOGGLE</code> (default), <code>TOC_EXPAND</code>, or
 *          <code>TOC_COLLAPSE</code>
 */
function __tocToggle(sNode,nMode)
{
  if (!nMode) nMode = TOC_TOGGLE;
  
  var iParent = document.getElementById(sNode);
  var aIAs = iParent.getElementsByTagName("a");
  if (aIAs.length==0 || aIAs[0].innerHTML.indexOf("[")!=0) return;
  
  var sDisplay;
  if (aIAs[0].innerHTML.indexOf("[+]")==0)
	sDisplay = (nMode==TOC_COLLAPSE ? "none" : "");
  else
	sDisplay = (nMode==TOC_EXPAND ? "" : "none");
  
  var aiDivs  = iParent.getElementsByTagName("div");
  for (i=0; i<aiDivs.length; i++)
  {
    var iDiv = aiDivs[i];
    iDiv.style.display = sDisplay;
  }
  aIAs[0].innerHTML = ( sDisplay=="" ? "[&minus;]" : "[+]" );
}

/**
 * Navigates to a named anchor in the dLabPro manual.
 * 
 * @param sUrl
 *          The URL, relative to the dLabPro manual root directory, of the 
 *          dLabPro manual page to navigate to (optional, default is
 *          <code>null</code> which navigates to the home page).
 * @param sHash
 *          The anchor name on the dLabPro manual page to navigate to 
 *          (optional, default is <code>null</code> which navigates to the top
 *          of the page).
 */
function __goDlabpro(sUrl,sHash)
{
  var sLocation = "..";
  try
  {
	sLocation = __sRootPath;
  }
  catch (e) {}
  sLocation += "/../dLabPro/manual/index.html";
  if (sUrl ) sLocation += "?"+sUrl;
  if (sHash) sLocation += ";"+sHash;
  var iWnd = window.open(sLocation,"dLabPro");
  iWnd.focus();
}

// EOF
